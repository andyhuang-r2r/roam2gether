/**
 * What to ask for when someone adds a booking by hand, per planner section.
 *
 * field: { key, label, type: 'text'|'date'|'time'|'number'|'select'|'textarea', options?, placeholder?, required?, half? }
 * `price` is the one money field; its unit depends on the section.
 */
const NOTES = { key: 'notes', label: 'Description / notes', type: 'textarea', placeholder: 'Anything the group should know' };
const REF = { key: 'ref', label: 'Confirmation number', type: 'text', placeholder: 'e.g. ABC123', half: true };
const LINK = { key: 'link', label: 'Link', type: 'text', placeholder: 'Booking page or website', half: true };

export const MANUAL_FORMS = {
  stay: {
    heading: 'Add accommodation',
    intro: 'Already found or booked somewhere to stay? Put it on the plan.',
    priceLabel: 'Price per night',
    priceUnit: 'night',
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Casa do Largo', required: true },
      { key: 'tag', label: 'Type', type: 'select', options: ['Hotel', 'Apartment', 'Hostel', 'B&B', 'Villa', 'Campsite', 'Other'], half: true },
      { key: 'location', label: 'Address or area', type: 'text', placeholder: 'e.g. Alfama', half: true },
      { key: 'start', label: 'Check-in', type: 'date', half: true },
      { key: 'end', label: 'Check-out', type: 'date', half: true },
      { key: 'price', label: 'Price per night', type: 'number', placeholder: '0', half: true },
      { key: 'guests', label: 'Guests', type: 'number', placeholder: '2', half: true },
      REF,
      LINK,
      NOTES,
    ],
  },
  do: {
    heading: 'Add something to do',
    intro: 'A tour, a show, a hike or a plan of your own.',
    priceLabel: 'Price per person',
    priceUnit: 'person',
    fields: [
      { key: 'name', label: 'Title', type: 'text', placeholder: 'e.g. Sunset sailing trip', required: true },
      { key: 'tag', label: 'Type', type: 'select', options: ['Tour', 'Event', 'Attraction', 'Show', 'Outdoors', 'Class', 'Other'], half: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Where it happens', half: true },
      { key: 'start', label: 'Date', type: 'date', half: true },
      { key: 'time', label: 'Start time', type: 'time', half: true },
      { key: 'price', label: 'Price per person', type: 'number', placeholder: '0', half: true },
      { key: 'duration', label: 'How long', type: 'text', placeholder: 'e.g. 2 hours', half: true },
      REF,
      LINK,
      NOTES,
    ],
  },
  eat: {
    heading: 'Add a place to eat',
    intro: 'A reservation, a recommendation or a spot you have to try.',
    priceLabel: 'Typical spend per person',
    priceUnit: 'person',
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Taberna da Rua', required: true },
      { key: 'tag', label: 'Type', type: 'select', options: ['Restaurant', 'Café', 'Bar', 'Street food', 'Bakery', 'Other'], half: true },
      { key: 'location', label: 'Address or area', type: 'text', placeholder: 'e.g. Bairro Alto', half: true },
      { key: 'start', label: 'Date', type: 'date', half: true },
      { key: 'time', label: 'Reservation time', type: 'time', half: true },
      { key: 'price', label: 'Typical spend per person', type: 'number', placeholder: '0', half: true },
      { key: 'guests', label: 'Table for', type: 'number', placeholder: '6', half: true },
      REF,
      LINK,
      NOTES,
    ],
  },
  move: {
    heading: 'Add a way to get around',
    intro: 'A train, transfer, car hire or ferry you have lined up.',
    priceLabel: 'Total price',
    priceUnit: 'total',
    fields: [
      { key: 'name', label: 'Title', type: 'text', placeholder: 'e.g. Train Lisbon → Porto', required: true },
      { key: 'tag', label: 'Type', type: 'select', options: ['Train', 'Bus', 'Ferry', 'Car hire', 'Transfer', 'Flight', 'Other'], half: true },
      { key: 'operator', label: 'Operator', type: 'text', placeholder: 'e.g. CP', half: true },
      { key: 'from', label: 'From', type: 'text', placeholder: 'Departure point', half: true },
      { key: 'to', label: 'To', type: 'text', placeholder: 'Arrival point', half: true },
      { key: 'start', label: 'Date', type: 'date', half: true },
      { key: 'time', label: 'Departure time', type: 'time', half: true },
      { key: 'price', label: 'Total price', type: 'number', placeholder: '0', half: true },
      { key: 'guests', label: 'Passengers', type: 'number', placeholder: '6', half: true },
      REF,
      LINK,
      NOTES,
    ],
  },
};
