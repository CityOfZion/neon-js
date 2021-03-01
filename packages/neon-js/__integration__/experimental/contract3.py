from boa3.builtin import public

def main() -> int:
    return 1

@public
def test_func() -> int:
    return 2

@public
def test_func2(value: int) -> int:
    return 1 + value