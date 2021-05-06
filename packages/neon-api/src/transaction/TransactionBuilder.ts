import { tx, sc, u, wallet } from "@cityofzion/neon-core";

export class TransactionBuilder {
  private vmScripts: (sc.ContractCall | string)[] = [];
  private networkFee: u.BigInteger = u.BigInteger.fromNumber(0);
  private systemFee: u.BigInteger = u.BigInteger.fromNumber(0);
  private validUntilBlock = 0;
  private attributes: tx.TransactionAttribute[] = [];
  private signers: tx.Signer[] = [];
  private witnesses: tx.Witness[] = [];

  public static newBuilder(): TransactionBuilder {
    return new TransactionBuilder();
  }

  /**
   * Adds the logic for claiming gas. Alternatively, you may just trigger the gas claim by performing an actual transaction involving NEO.
   * @param account - Account to claim gas on.
   */
  public addGasClaim(account: wallet.Account): TransactionBuilder {
    const address = account.address;
    return this.addContractCall(
      sc.NeoContract.INSTANCE.transfer(address, address, 0)
    )
      .addSigners({
        account: account.scriptHash,
        scopes: tx.WitnessScope.CalledByEntry,
      })
      .addEmptyWitness(account);
  }

  /**
   *  Adds the logic to send tokens around.
   * @param account - originating account
   * @param destination - account where the tokens will be sent
   * @param tokenScriptHash - scripthash of the token contract
   * @param amt - Amount of tokens in integer format.
   */
  public addNep17Transfer(
    account: wallet.Account,
    destination: string,
    tokenScriptHash: string,
    amt: number | string | u.BigInteger
  ): TransactionBuilder {
    const address = account.address;
    const contract = new sc.Nep17Contract(tokenScriptHash);
    return this.addContractCall(contract.transfer(address, destination, amt))
      .addSigners({
        account: account.scriptHash,
        scopes: tx.WitnessScope.CalledByEntry,
      })
      .addEmptyWitness(account);
  }

  /**
   * Adds the logic to vote for a candidate.
   * @param account - Account containing the NEO.
   * @param candidatePublicKey - The candidate's publickey in hex big endian.
   */
  public addVote(
    account: wallet.Account,
    candidatePublicKey: string
  ): TransactionBuilder {
    const address = account.address;

    return this.addContractCall(
      sc.NeoContract.INSTANCE.vote(address, candidatePublicKey)
    )
      .addSigners({
        account: account.scriptHash,
        scopes: tx.WitnessScope.CalledByEntry,
      })
      .addEmptyWitness(account);
  }

  /**
   * Sets an account to pay fees for this transaction.
   * The first Signer defaults to the payer.
   * @param account - Account to pay fees from.
   */
  public setFeeAccount(account: wallet.Account): this {
    const ind = this.signers.findIndex((s) =>
      s.account.equals(account.scriptHash)
    );

    // Signer exists. We shift it to first in array to become the sender.
    if (ind > 0) {
      const s = this.signers.splice(ind, 1)[0];
      this.signers.unshift(s);
      return this;
    } else if (ind === -1) {
      this.signers.unshift(
        new tx.Signer({
          account: account.scriptHash,
          scopes: tx.WitnessScope.None,
        })
      );
      return this.addEmptyWitness(account);
    }
    // Account is already the sender.
    return this;
  }

  /**
   * Add signers. Will deduplicate signers and merge scopes.
   */
  public addSigners(...signers: tx.SignerLike[]): this {
    for (const newSigner of signers) {
      const ind = this.signers.findIndex((s) =>
        s.account.equals(newSigner.account)
      );
      if (ind !== -1) {
        this.signers[ind].merge(newSigner);
      } else {
        this.signers.push(new tx.Signer(newSigner));
      }
    }
    return this;
  }

  /**
   * You can add multiple intents to the transaction
   */
  public addContractCall(...contractCalls: sc.ContractCall[]): this {
    this.vmScripts = this.vmScripts.concat(contractCalls);
    return this;
  }

  public addScript(hexString: string): this {
    this.vmScripts.push(hexString);
    return this;
  }

  /**
   * Add an attribute.
   * @param usage - The usage type. Do refer to txAttrUsage enum values for all available options.
   * @param data - The data as hexstring.
   */
  public addAttributes(...attrs: tx.TransactionAttributeLike[]): this {
    this.attributes = this.attributes.concat(
      attrs.map((a) => new tx.TransactionAttribute(a))
    );
    return this;
  }

  /**
   * Adds an unsigned witness to the transaction.
   * Will deduplicate witnesses based on verificationScript.
   * Required to calculate the network fee correctly.
   */
  public addEmptyWitness(account: wallet.Account): this {
    const verificationScript = u.HexString.fromBase64(account.contract.script);
    if (
      !this.witnesses.some((w) =>
        w.verificationScript.equals(verificationScript)
      )
    ) {
      this.witnesses.push(
        new tx.Witness({
          verificationScript,
          invocationScript: u.HexString.fromHex(""),
        })
      );
    }
    return this;
  }

  public setSystemFee(fee: u.BigInteger): this {
    this.systemFee = fee;
    return this;
  }

  public setNetworkFee(fee: u.BigInteger): this {
    this.networkFee = fee;
    return this;
  }

  public build(): tx.Transaction {
    return new tx.Transaction({
      networkFee: this.networkFee,
      systemFee: this.systemFee,
      signers: this.signers,
      attributes: this.attributes,
      validUntilBlock: this.validUntilBlock,
      script: this.vmScripts
        .reduce(
          (sb, cc) =>
            typeof cc === "string"
              ? sb.appendScript(cc)
              : sb.emitContractCall(cc),
          new sc.ScriptBuilder()
        )
        .build(),
      witnesses: this.witnesses,
    });
  }
}
