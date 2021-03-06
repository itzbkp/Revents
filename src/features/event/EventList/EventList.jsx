import React, { Component } from "react";
import EventListItem from "./EventListItem";

class EventList extends Component {
  render() {
    const { events, onEventDelete } = this.props;
    return (
      <div>
        {events.map(event => {
          return (
            <EventListItem
              key={event.id}
              event={event}
              onEventDelete={onEventDelete}
            />
          );
        })}
      </div>
    );
  }
}

export default EventList;
