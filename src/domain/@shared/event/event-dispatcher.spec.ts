import Customer from "../../customer/entity/customer";
import CustomerChangeAddressEvent from "../../customer/event/handler/customer-change-address.event";
import CustomerChangeAddressHandler from "../../customer/event/handler/customer-change-address.handler";
import CustomerCreatedHandlerOne from "../../customer/event/handler/customer-created-one.handler";
import CustomerCreatedHandlerTwo from "../../customer/event/handler/customer-created-two.handler";
import CustomerCreatedEvent from "../../customer/event/handler/customer-created.event";
import Address from "../../customer/value-object/address";
import ProductCreatedEvent from "../../product/event/handler/product-created.event";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  describe("Product Event dispatcher tests", () => {
    it("should register an event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendEmailWhenProductIsCreatedHandler();

      eventDispatcher.register("ProductCreatedEvent", eventHandler);

      expect(
        eventDispatcher.getEventHandlers["ProductCreatedEvent"]
      ).toBeDefined();
      expect(
        eventDispatcher.getEventHandlers["ProductCreatedEvent"].length
      ).toBe(1);
      expect(
        eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
      ).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendEmailWhenProductIsCreatedHandler();

      eventDispatcher.register("ProductCreatedEvent", eventHandler);

      expect(
        eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
      ).toMatchObject(eventHandler);

      eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

      expect(
        eventDispatcher.getEventHandlers["ProductCreatedEvent"]
      ).toBeDefined();
      expect(
        eventDispatcher.getEventHandlers["ProductCreatedEvent"].length
      ).toBe(0);
    });

    it("should unregister all event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendEmailWhenProductIsCreatedHandler();

      eventDispatcher.register("ProductCreatedEvent", eventHandler);

      expect(
        eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
      ).toMatchObject(eventHandler);

      eventDispatcher.unregisterAll();

      expect(
        eventDispatcher.getEventHandlers["ProductCreatedEvent"]
      ).toBeUndefined();
    });

    it("should notify all event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendEmailWhenProductIsCreatedHandler();
      const spyEventHandler = jest.spyOn(eventHandler, "handle");

      eventDispatcher.register("ProductCreatedEvent", eventHandler);

      expect(
        eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
      ).toMatchObject(eventHandler);

      const productCreatedEvent = new ProductCreatedEvent({
        name: "Product 1",
        description: "Product 1 description",
        price: 10.0,
      });

      // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
      eventDispatcher.notify(productCreatedEvent);

      expect(spyEventHandler).toHaveBeenCalled();
    });
  });

  describe("Customer Event dispatcher tests", () => {
    it("should register an event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandlerOne = new CustomerCreatedHandlerOne();
      const eventHandlerTwo = new CustomerCreatedHandlerTwo();

      eventDispatcher.register("CustomerCreatedEvent", eventHandlerOne);
      eventDispatcher.register("CustomerCreatedEvent", eventHandlerTwo);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
      ).toBeDefined();

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
      ).toBe(2);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandlerOne);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
      ).toMatchObject(eventHandlerTwo);
    });

    it("should unregister an event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandlerOne = new CustomerCreatedHandlerOne();
      const eventHandlerTwo = new CustomerCreatedHandlerTwo();

      eventDispatcher.register("CustomerCreatedEvent", eventHandlerOne);
      eventDispatcher.register("CustomerCreatedEvent", eventHandlerTwo);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandlerOne);

      eventDispatcher.unregister("CustomerCreatedEvent", eventHandlerOne);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
      ).toBeDefined();
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
      ).toBe(1);
    });

    it("should unregister all event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandlerOne = new CustomerCreatedHandlerOne();
      const eventHandlerTwo = new CustomerCreatedHandlerTwo();

      eventDispatcher.register("CustomerCreatedEvent", eventHandlerOne);
      eventDispatcher.register("CustomerCreatedEvent", eventHandlerTwo);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandlerOne);

      eventDispatcher.unregisterAll();

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
      ).toBeUndefined();
    });

    it("should notify all event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandlerOne = new CustomerCreatedHandlerOne();
      const eventHandlerTwo = new CustomerCreatedHandlerTwo();

      eventDispatcher.register("CustomerCreatedEvent", eventHandlerOne);
      eventDispatcher.register("CustomerCreatedEvent", eventHandlerTwo);

      const spyEventHandlerOne = jest.spyOn(eventHandlerOne, "handle");
      const spyEventHandlerTwo = jest.spyOn(eventHandlerTwo, "handle");

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandlerOne);

      const customer = new Customer("1", "Customer 1");

      const customerCreatedEvent = new CustomerCreatedEvent(customer);

      eventDispatcher.notify(customerCreatedEvent);

      expect(spyEventHandlerOne).toHaveBeenCalled();
      expect(spyEventHandlerTwo).toHaveBeenCalled();
    });

    it("should register an event handler when change customer address", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new CustomerChangeAddressHandler();
      const spyEventHandler = jest.spyOn(eventHandler, "handle");

      const customer = new Customer("1", "Customer 1");
      const address = new Address("Street 1", 123, "13330-250", "São Paulo");
      customer.Address = address;
      expect(customer.Address).toMatchObject(address);

      const newAddress = new Address("Street 2", 456, "13330-250", "São Paulo");
      customer.Address = newAddress;
      expect(customer.Address).toMatchObject(newAddress);

      eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);

      expect(
        eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]
      ).toMatchObject(eventHandler);

      const customerChangeAddressEvent = new CustomerChangeAddressEvent(
        customer
      );

      eventDispatcher.notify(customerChangeAddressEvent);

      expect(spyEventHandler).toHaveBeenCalled();
    });
  });
});
