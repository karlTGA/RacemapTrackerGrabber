// <reference path="../type_declarationes/async-csv.d.ts"
import * as React from "react";
import { Text, Box } from "ink";
import * as fs from "fs";
import { testAndCreateFolder } from "../utils";
import * as moment from "moment";

import { Trackers } from "../types/types";

type Props = {
  trackers: Trackers;
};

type State = {
  saving: boolean;
  folderExists: boolean;
  lastUpdates: LastUpdates;
};

type LastUpdates = {
  [key: string]: moment.Moment | null;
};

const saveFolder = "./saves";

class SaveInCSV extends React.Component<Props, State> {
  timer: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);

    this.timer = null;
    this.state = {
      saving: false,
      folderExists: false,
      lastUpdates: {}
    };
  }

  componentDidMount = () => {
    this.createFiles();
    // this.syncLastUpdatedAt();

    this.saveInCSV();
    this.timer = setInterval(this.saveInCSV, 10000);
  };

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.trackers.length !== this.props.trackers.length) {
      this.createFiles();
    }
  };

  componentWillUnmount = () => {
    if (this.timer != null) {
      clearInterval(this.timer);
    }
  };

  createFiles = () => {
    const err = testAndCreateFolder(saveFolder);
    if (err != null) throw err;

    this.setState({
      folderExists: true
    });
  };

  syncLastUpdatedAt = () => {
    const { lastUpdates } = this.state;
    const { trackers } = this.props;
    const newUpdatedAt = { ...lastUpdates };

    // get old updated at
    for (const tracker of Object.values(trackers)) {
      if (lastUpdates[tracker.id] == null) newUpdatedAt[tracker.id] = moment(0);
    }

    this.setState({
      lastUpdates: newUpdatedAt
    });
  };

  saveInCSV = () => {
    const { lastUpdates } = this.state;
    const { trackers } = this.props;
    const newUpdatedAt = { ...lastUpdates };

    //if (!folderExists || saving) return;
    this.setState({
      saving: true
    });

    for (const tracker of Object.values(trackers)) {
      const err = testAndCreateFolder(`${saveFolder}/${tracker.id}`);
      if (err != null) throw err;

      const today = moment().format("YYYY-MM-DD");
      const csvPath = `${saveFolder}/${tracker.id}/${today}.csv`;
      // create csv if necassary
      try {
        fs.accessSync(csvPath, fs.constants.W_OK);
      } catch (err) {
        fs.writeFileSync(
          csvPath,
          `timestamp,${Object.keys(tracker.state).join(",")} \n`
        );
      }

      // set very old date for first compare
      if (lastUpdates[tracker.id] == null) newUpdatedAt[tracker.id] = moment(0);

      if (moment(tracker.updatedAt).isAfter(newUpdatedAt[tracker.id])) {
        fs.appendFileSync(
          csvPath,
          `${tracker.updatedAt},${Object.values(tracker.state).join(",")} \n`
        );

        newUpdatedAt[tracker.id] = moment(tracker.updatedAt);
      }
    }

    this.setState({
      lastUpdates: newUpdatedAt,
      saving: false
    });
  };

  render() {
    const { trackers } = this.props;
    const { saving, lastUpdates } = this.state;

    return (
      <Box marginTop={1}>
        <Box flexDirection="column">
          <Text>
            {saving
              ? "Saving..."
              : `Prepare Saving of ${Object.values(trackers).length} Trackers`}
          </Text>
        </Box>
      </Box>
    );
  }
}

export default SaveInCSV;
