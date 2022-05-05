import React from 'react';
import { Chart, Series, ArgumentAxis, CommonSeriesSettings, Export, Legend, Margin, Title, Subtitle, Tooltip, Grid } from 'devextreme-react/chart';

const colors = [
    '#FF6900',
    '#00D084',
    '#9900EF',
    '#0693E3',
    '#FF6900',
    '#F78DA7',
    '#009688',
    '#607d8b',
    '#795548',
    '#afb42b'
];

export default class AnomalyChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            subjects: props.subjects
        };
        this.handleChange = this.handleChange.bind(this);
    };

    render() {
        return (
            <React.Fragment>
                <Chart
                    palette="Violet"
                    dataSource={this.state.data}
                >
                    <CommonSeriesSettings
                        argumentField="date"
                        type="line"
                    />
                    {
                        this.state.subjects.map(function (item, index) {
                            return <Series color={colors[index % 10]} key={index} valueField={item} name={item} />;
                        })
                    }
                    <Margin bottom={20} />
                    <ArgumentAxis
                        valueMarginsEnabled={false}
                        discreteAxisDivisionMode="crossLabels"
                    >
                        <Grid visible={true} />
                    </ArgumentAxis>
                    <Legend
                        verticalAlignment="bottom"
                        horizontalAlignment="center"
                        itemTextPosition="bottom"
                    />
                    <Export enabled={true} />
                    <Title text="Anomaly Expens Payments Detector">
                        <Subtitle text="(2022 - 2022 : April - June)" />
                    </Title>
                    <Tooltip enabled={true} />
                </Chart>
            </React.Fragment>
        );
    }

    handleChange(e) {
        this.setState({ type: e.value });
    }
}
