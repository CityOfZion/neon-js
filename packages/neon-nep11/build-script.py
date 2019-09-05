try:
    from boa.compiler import Compiler
    import tempfile
    import sys

    hsh = sys.argv[1]
    address = sys.argv[2]
    index = int(sys.argv[3])
    limit = int(sys.argv[4])

    beginning = """
from boa.interop.Neo.App import RegisterAppCall
from boa.interop.Neo.Iterator import Iterator

enumerate = RegisterAppCall("""

    middle = """, 'operation', 'args')

def Main():
    address = """

    end = """
    token_iter = enumerate('tokensOf', [address])
    count = 0
    result = []
    limit = """

    num = """
    start = """ + str(index) + """ * limit

    """

    nxt = """while token_iter.next() and (count < limit):
        if count >= start:
            result.append(token_iter.Value)
        count += 1
    return result"""
    script = beginning + "'" + hsh + "'" + middle + str(bytearray.fromhex(address)) + end + str(limit) + num + nxt

    tp = tempfile.NamedTemporaryFile()
    tp.write(str.encode(script))
    tp.flush()
    compiler = Compiler.load(tp.name)
    avm = compiler.write()
    avm = avm.hex()
    print(avm)
    sys.stdout.flush()
except Exception as exception:
    print(exception)
    sys.stdout.flush()
