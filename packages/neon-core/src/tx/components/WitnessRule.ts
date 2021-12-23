import { NeonLike, parseEnum } from "../../internal";
import { NeonSerializable, StringStream } from "../../u";
import {
  CalledByEntryWitnessCondition,
  WitnessCondition,
  WitnessConditionJson,
} from "./WitnessCondition";

export enum WitnessRuleAction {
  Deny = 0,

  Allow = 1,
}

export interface WitnessRuleJson {
  action: string;
  condition: WitnessConditionJson;
}

export type WitnessRuleLike = NeonLike<WitnessRule, WitnessRuleJson>;
export class WitnessRule implements NeonSerializable {
  public action: WitnessRuleAction;

  public condition: WitnessCondition;

  public get size(): number {
    return 1 + this.condition.size;
  }

  public static deserialize(ss: StringStream): WitnessRule {
    const action = parseEnum(ss.read(1), WitnessRuleAction);
    const condition = WitnessCondition.deserialize(ss);
    return new WitnessRule({ action, condition });
  }

  public static fromJson(input: WitnessRuleJson): WitnessRule {
    return new WitnessRule(input);
  }
  constructor(input: Partial<WitnessRuleLike> = {}) {
    this.action =
      input.action !== undefined
        ? parseEnum(input.action, WitnessRuleAction)
        : WitnessRuleAction.Deny;
    this.condition =
      input.condition !== undefined
        ? input.condition instanceof WitnessCondition
          ? input.condition
          : WitnessCondition.fromJson(input.condition)
        : new CalledByEntryWitnessCondition();
  }

  public serialize(): string {
    return (
      this.action.toString(16).padStart(2, "0") + this.condition.serialize()
    );
  }

  public toJson(): WitnessRuleJson {
    return {
      action: WitnessRuleAction[this.action],
      condition: this.condition.toJson(),
    };
  }
}
