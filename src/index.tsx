import * as React from "react";
import { render, Text, Box } from "ink";
import LoadTrackers from "./components/LoadTrackers";
import TrackerList from "./components/TrackerList";
import SaveInCSV from "./components/SaveInCSV";

import { Trackers } from "./types/types";

class App extends React.Component {
  state: {
    trackers: Trackers;
  };

  constructor(props: {}) {
    super(props);

    this.state = {
      trackers: {}
    };
  }

  handleTrackerUpdate = (newTrackers: Trackers) => {
    this.setState({
      trackers: newTrackers
    });
  };

  render() {
    return (
      <Box width={10} flexDirection="column">
        <Text bold underline>
          >>Racemap Tracker Graber
        </Text>
        <LoadTrackers onTrackerUpdate={this.handleTrackerUpdate} />

        <Box height={2}>
          Found {Object.keys(this.state.trackers).length} Trackers
        </Box>

        <TrackerList trackers={this.state.trackers} />
        <SaveInCSV trackers={this.state.trackers} />
      </Box>
    );
  }
}

render(<App />);
