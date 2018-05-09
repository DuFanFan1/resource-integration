import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import { Link, HashRouter } from 'react-router-dom';

// 统计分析
import Statistics_Index from '../components/statistics/Statistics_Index.js';
import MapStatistics from '../components/statistics/MapStatistics.js';
import ResourceStatistic from '../components/statistics/ResourceStatistic.js';
import KnowledgeStatistic from '../components/statistics/KnowledgeStatistic.js';

export default class RouterStatistic extends Component {
    render() {
        return (
            <Statistics_Index>
                <Route path="/App/Statistics_Index/MapStatistics" component={MapStatistics} />
                <Route path="/App/Statistics_Index/ResourceStatistic" component={ResourceStatistic} />
                <Route path="/App/Statistics_Index/KnowledgeStatistic" component={KnowledgeStatistic} />
            </Statistics_Index>
        )
    }
}