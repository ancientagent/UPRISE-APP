const sayHello = () => 'Hello';

test('sayHello should return Hello ', () => {
    expect(sayHello()).toBe('Hello');
});
