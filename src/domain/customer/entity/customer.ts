import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerChangeAddressEvent from "../event/handler/customer-change-address.event";
import CustomerChangeAddressHandler from "../event/handler/customer-change-address.handler";
import CustomerCreatedHandlerOne from "../event/handler/customer-created-one.handler";
import CustomerCreatedHandlerTwo from "../event/handler/customer-created-two.handler";
import CustomerCreatedEvent from "../event/handler/customer-created.event";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }

  static create(id: string, name: string): Customer {
    const customer = new Customer(id, name);

    const eventDispatcher = new EventDispatcher();
    const event = new CustomerCreatedEvent(customer);

    eventDispatcher.register(
      "CustomerCreatedEvent",
      new CustomerCreatedHandlerOne()
    );
    eventDispatcher.register(
      "CustomerCreatedEvent",
      new CustomerCreatedHandlerTwo()
    );
    eventDispatcher.notify(event);

    return customer;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;

    const eventDispatcher = new EventDispatcher();
    const event = new CustomerChangeAddressEvent(this);

    eventDispatcher.register(
      "CustomerChangeAddressEvent",
      new CustomerChangeAddressHandler()
    );
    eventDispatcher.notify(event);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
