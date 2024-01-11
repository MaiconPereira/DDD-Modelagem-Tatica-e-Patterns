import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "./customer-change-address.event";

export default class CustomerChangeAddressHandler
  implements EventHandlerInterface<CustomerChangeAddressEvent>
{
  handle(event: CustomerChangeAddressEvent): void {
    return console.log(
      `Endereço do cliente: ${event.eventData.id}, ${
        event.eventData.name
      } alterado para ${JSON.stringify(event.eventData._address)}`
    );
  }
}
