import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon } from "semantic-ui-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testConstants";
import GoogleMapReact from "google-map-react";

const Marker = () => <Icon name="marker" size="big" color="red" />;

class TestComponent extends Component {
  state = {
    address: "",
    scriptLoaded: false
  };

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  handleScriptLoad = () => {
    this.setState({
      scriptLoaded: true
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log("Success", latLng))
      .catch(error => console.error("Error", error));
  };

  onChange = address => {
    this.setState({ address });
  };

  render() {
    const { incrementCounter, decrementCounter, test } = this.props;

    const inputProps = {
      value: this.state.address,
      onChange: this.onChange
    };

    return (
      <React.Fragment>
        {/* <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuSEJLhxZo7eLnMx01vJcskU3BAfRI_uY&libraries=places"
          onLoad={this.handleScriptLoad}
        /> */}
        <h1>The data: {test.data}</h1>
        <Button
          onClick={() => incrementCounter(2)}
          color="green"
          content="Increment"
        />
        <Button
          onClick={() => decrementCounter(1)}
          color="red"
          content="Decrement"
        />
        <br />
        <br />
        <form onSubmit={this.handleFormSubmit}>
          {this.state.scriptLoaded && (
            <PlacesAutocomplete inputProps={inputProps} />
          )}
          <button type="submit">Submit</button>
        </form>
        <div style={{ height: "300px", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyDuSEJLhxZo7eLnMx01vJcskU3BAfRI_uY"
            }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
          >
            <Marker lat={59.955413} lng={30.337844} text={"Kreyser Avrora"} />
          </GoogleMapReact>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  state => {
    return { test: state.test };
  },
  {
    incrementCounter: data => {
      return { type: INCREMENT_COUNTER, payloads: data, payload: data };
    },
    decrementCounter: data => {
      return { type: DECREMENT_COUNTER, payloads: data, payload: data };
    }
  }
)(TestComponent);
