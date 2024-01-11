import EventDispatcher from "../../@shared/event/event-dispatcher";
import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should create a customer", () => {
    const customer = Customer.create("1", "Customer 1");
    expect(customer.id).toBe("1");
    expect(customer.name).toBe("Customer 1");
    expect(customer.isActive()).toBe(false);
  });

  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = Customer.create("", "John");
    }).toThrow("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = Customer.create("123", "");
    }).toThrow("Name is required");
  });

  it("should change name", () => {
    const customer = Customer.create("123", "John");
    customer.changeName("Jane");
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = Customer.create("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should change customer address", () => {
    const customer = Customer.create("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");

    customer.Address = address;

    expect(customer.Address).toMatchObject(address);

    const newAddress = new Address("Street 2", 456, "13330-250", "São Paulo");
    customer.changeAddress(newAddress);

    expect(customer.Address).toMatchObject(newAddress);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = Customer.create("1", "Customer 1");
      customer.activate();
    }).toThrow("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = Customer.create("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = Customer.create("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });
});
