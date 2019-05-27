import * as React from "react";
import { Text, Box } from "ink";

import { Trackers } from "../types/types";

type Props = {
  trackers: Trackers;
};

const TrackerList = ({ trackers }: Props) => {
  const [page, setPage] = React.useState(0);

  const trackerList = Object.values(trackers).slice(page * 6, page * 6 + 6);

  return (
    <Box height={6} width={10} flexDirection="column" marginTop={1}>
      {trackerList.map(tracker => (
        <Box height={1}>
          <Text>{tracker.trackerId}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default TrackerList;
