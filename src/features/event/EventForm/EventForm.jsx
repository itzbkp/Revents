/* global google*/
import React, { Component } from "react";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import moment from "moment";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import { createEvent, updateEvent } from "../EventActions";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import cuid from "cuid";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Script from "react-load-script";

const category = [
  { key: "drinks", text: "Drinks", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
  { key: "travel", text: "Travel", value: "travel" }
];

const validate = combineValidators({
  title: isRequired({ message: "Title is mandatory" }),
  category: isRequired({ message: "Please provide a category" }),
  description: composeValidators(
    isRequired({ message: "Please give any description" }),
    hasLengthGreaterThan(4)({
      message: "Description has to be atleast of 5 characters"
    })
  )(),
  city: isRequired("city"),
  venue: isRequired("venue"),
  date: isRequired("date")
});

class EventForm extends Component {
  state = {
    cityLatLng: "",
    venueLatLng: {},
    scriptLoaded: false
  };

  handleCitySelect = city => {
    geocodeByAddress(city)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({ cityLatLng: latlng });
      })
      .then(() => {
        this.props.change("city", city);
      });
  };

  handleVenueSelect = venue => {
    geocodeByAddress(venue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({ venueLatLng: latlng });
      })
      .then(() => {
        this.props.change("venue", venue);
      });
  };

  handleScriptLoaded = () => {
    this.setState({ scriptLoaded: true });
  };

  onFormSubmit = values => {
    values.date = moment(values.date).format();
    values.venueLatLng = this.state.venueLatLng;
    if (this.props.initialValues) {
      this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      const newEvent = {
        ...values,
        id: cuid(),
        hostPhotoURL: "/assets/user.png",
        hostedBy: "Bob"
      };
      this.props.createEvent(newEvent);
      this.props.history.push("/events");
    }
  };

  render() {
    const { invalid, submitting, pristine } = this.props;

    return (
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuSEJLhxZo7eLnMx01vJcskU3BAfRI_uY&libraries=places"
          onLoad={this.handleScriptLoaded}
        />

        <Grid.Column width={10}>
          <Segment>
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Header sub color="teal" content="Event Details" />
              <Field
                name="title"
                type="text"
                component={TextInput}
                placeholder="Event Title"
              />
              <Field
                name="category"
                type="text"
                component={SelectInput}
                options={category}
                placeholder="Event Category"
              />
              <Field
                name="description"
                type="text"
                rows={3}
                component={TextArea}
                placeholder="Event Description"
              />
              <Header sub color="teal" content="Event Location Details" />

              <Field
                name="city"
                type="text"
                options={{ types: ["(cities)"] }}
                component={PlaceInput}
                onSelect={this.handleCitySelect}
                placeholder="Event City"
              />
              {this.state.scriptLoaded && (
                <Field
                  name="venue"
                  options={{
                    types: ["establishment"],
                    location: new google.maps.LatLng(this.state.cityLatLng),
                    radius: 1000
                  }}
                  type="text"
                  component={PlaceInput}
                  onSelect={this.handleVenueSelect}
                  placeholder="Event Venue"
                />
              )}
              <Field
                name="date"
                type="text"
                component={DateInput}
                dateFormat="YYYY-MM-DD HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                placeholder="Date & Time"
              />
              <Button
                disabled={invalid || submitting || pristine}
                positive
                type="submit"
              >
                Submit
              </Button>
              <Button type="button" onClick={this.props.history.goBack}>
                Cancel
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return {
      initialValues: state.events.filter(
        event => event.id === ownProps.match.params.id
      )[0]
    };
  },
  { createEvent, updateEvent }
)(
  reduxForm({ form: "eventForm", enableReinitialize: true, validate })(
    EventForm
  )
);
