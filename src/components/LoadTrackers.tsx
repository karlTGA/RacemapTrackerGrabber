import * as React from "react";
import fetch, { Headers } from "cross-fetch";
import { Color, Text, Box } from "ink";
import { Trackers, Tracker } from "../types/types";

type Props = {
  onTrackerUpdate: (newTrackers: Trackers) => void;
};

const LoadTrackers = ({ onTrackerUpdate }: Props) => {
  const host = process.env.HOST || "https://racemap.com";
  const username = process.env.USERNAME;
  if (username == null)
    throw Error("No username was set. Set a username per env.");

  const password = process.env.PASSWORD;
  if (password == null)
    throw Error("No password was set. Set a password per env.");

  const [fetchTracker, setFetch] = React.useState(false);
  const [fetchError, setFetchError] = React.useState("");

  const loadTrackerFromServer = async () => {
    if (!fetchTracker) {
      setFetch(true);
      setFetchError("");

      const headers = new Headers();
      headers.append(
        "Authorization",
        "Basic " + Buffer.from(username + ":" + password).toString("base64")
      );
      const res = await fetch(
        `${host}/api/trackers?filter=SHOW_OWNED_AND_BORROWED`,
        {
          method: "GET",
          headers
        }
      );

      if (res.status >= 400) {
        setFetchError("Failed to fetch data from racemap: " + res.statusText);
        setFetch(false);
        return;
      }

      const body: [Tracker] = await res.json();
      const trackerMap: Trackers = {};
      for (const tracker of body) {
        trackerMap[tracker.id] = tracker;
      }

      onTrackerUpdate(trackerMap);
      setFetch(false);
    }
  };

  React.useEffect(() => {
    loadTrackerFromServer();
    const timer = setInterval(loadTrackerFromServer, 10000);

    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box>
      {fetchError === "" ? (
        <Text>
          {fetchTracker
            ? "Request Tracker from Server"
            : "Wait for next load cycle"}
        </Text>
      ) : (
        <Color red>{fetchError}</Color>
      )}
    </Box>
  );
};

export default LoadTrackers;
