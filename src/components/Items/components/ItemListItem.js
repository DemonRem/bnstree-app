import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import {typeSelector} from '../selectors'

import BadgeContent from './BadgeContent'
import SoulshieldContent from './SoulshieldContent'

import {Collapse} from 'antd'
const Panel = Collapse.Panel

const itemImagePaths = {
    badge: 'https://static.bnstree.com/images/badges/',
    soulshield: 'https://static.bnstree.com/images/soulshields/'
}

const mapStateToProps = state => {
    return {
        type: typeSelector(state)
    }
}

const ItemListItem = props => {
    const {t, type, item, itemId} = props

    let subtitle = []
    let content = null
    switch (type) {
        case 'badge':
            content = <BadgeContent item={item} itemId={itemId} />
            break
        case 'soulshield':
            if (item.get('group')) {
                subtitle.push(<p key="group">{t(item.get('group'))}</p>)
            }
            content = <SoulshieldContent item={item} itemId={itemId} />
            break
        default:
            content = null
    }

    if (item.get('classCode') && item.get('classCode') !== 'ALL') {
        subtitle.push(<p key="class">{t(item.get('classCode'))}</p>)
    }

    return (
        <div className={`item-list-item ${type}`}>
            <Collapse bordered={false}>
                <Panel
                    header={
                        <div className="item-header">
                            <img
                                className="item-icon"
                                alt={item.get('name')}
                                src={itemImagePaths[type] + item.get('icon', 'blank')}
                            />
                            <div className="title">
                                <h3 className={`grade_${item.get('grade')}`}>{item.get('name')}</h3>
                                <div className="subtitle">{subtitle}</div>
                            </div>
                        </div>
                    }>
                    {content}
                </Panel>
            </Collapse>
        </div>
    )
}

export default connect(mapStateToProps)(translate('items')(ItemListItem))
