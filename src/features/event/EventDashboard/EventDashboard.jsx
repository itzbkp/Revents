import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import EventList from "../EventList/EventList";
import { connect } from "react-redux";
import { deleteEvent } from "../EventActions";

class EventDashboard extends Component {
  handleDeleteEvent = eventID => () => {
    this.props.deleteEvent(eventID);
  };

  render() {
    const { events } = this.props;

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList events={events} onEventDelete={this.handleDeleteEvent} />
        </Grid.Column>
        <Grid.Column width={6} />
      </Grid>
    );
  }
}

export default connect(
  state => {
    return { events: state.events };
  },
  { deleteEvent }
)(EventDashboard);
