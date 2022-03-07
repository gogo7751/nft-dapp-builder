import React from 'react'
import { Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { blueGrey } from '@mui/material/colors';

export default function Roadmap(data) {
    const theme = useTheme();
    const RoadmapQuarter = styled(Typography)({
        textAlign: "left",
        fontSize: 20,
        marginLeft: "20%",
    })
    const RoadmapContent = styled(Typography)({
        textAlign: "left",
        marginBottom: theme.spacing(4),
        fontSize: 15,
        marginLeft: "20%",
    })
    return (
        <div>
            <Typography variant="h3" sx={{
                textAlign: "center",
                marginTop: theme.spacing(5)
            }}>
                {data.roadmap.title}
            </Typography>
            <Typography sx={{
                textAlign: "center",
                marginTop: theme.spacing(2),
                color: blueGrey[600]
            }}>
                {data.roadmap.subtitle}
            </Typography>
            <Timeline
                sx={{
                    "& .MuiTimelineContent-root": {
                        flex: 20
                    },
                    ml: "15%",
                    mt: 5
                }}>
                {
                    data.roadmap.items?.map((item, index, data) => {
                        if (index + 1 === data.length) {
                            return (
                                < TimelineItem key={index} >
                                    <TimelineSeparator>
                                        <TimelineDot sx={{ border: 1, borderColor: blueGrey[700], height: 10, width: 10, }} />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <RoadmapQuarter>
                                            {item.primary}
                                        </RoadmapQuarter>
                                        <RoadmapContent>
                                            {item.secondary}
                                        </RoadmapContent>
                                    </TimelineContent>
                                </TimelineItem>
                            )
                        } else {
                            return (
                                < TimelineItem key={index}>
                                    <TimelineSeparator>
                                        <TimelineDot sx={{ border: 1, borderColor: blueGrey[700], height: 10, width: 10, }} />
                                        <TimelineConnector sx={{ width: 3, backgroundColor: blueGrey[600] }} />
                                    </TimelineSeparator>
                                    <TimelineContent >
                                        <RoadmapQuarter>
                                            {item.primary}
                                        </RoadmapQuarter>
                                        <RoadmapContent>
                                            {item.secondary}
                                        </RoadmapContent>
                                    </TimelineContent>
                                </TimelineItem>)
                        }
                    })}
            </Timeline>
        </div >
    )
}