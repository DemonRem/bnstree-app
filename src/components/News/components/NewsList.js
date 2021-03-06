import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { List } from 'immutable'

import { Pagination } from 'antd'

import { loadNews } from '../actions'
import { listSelector } from '../selectors'

import NewsListItem from './NewsListItem'

const mapStateToProps = state => {
    return {
        list: listSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadNews: page => dispatch(loadNews(page))
    }
}

class NewsList extends React.PureComponent {
    componentDidMount() {
        this.props.loadNews(1)
    }

    render() {
        let { list, loadNews, currentId, icon } = this.props

        let rows = []
        list.get('list', List()).forEach((article, i) => {
            rows.push(
                <NewsListItem
                    article={article}
                    key={i}
                    selected={currentId === article.get('_id')}
                    icon={icon}
                />
            )
        })

        return (
            <div className="news-list-container">
                <div className="news-list listing">
                    {rows.length > 0 ? rows : <p className="no-data">No Data</p>}
                </div>
                <Pagination
                    size="small"
                    total={list.get('count', 0)}
                    current={list.get('page', 1)}
                    pageSize={list.get('limit', 10)}
                    onChange={p => loadNews(p)}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('general')(NewsList))
