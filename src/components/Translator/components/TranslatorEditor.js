import React from 'react'
import {connect} from 'react-redux'

import {Badge} from 'antd'

import TranslatorExample from './TranslatorExample'

import {
    namespaceSelector,
    groupSelector,
    referenceGroupDataSelector,
    languageGroupDataSelector,
    nameDataSelector,
    languageSelector,
    dataStatusSelector,
    exampleDataSelector
} from '../selectors'
import {editTranslation, editNameTranslation} from '../actions'

const mapStateToProps = state => {
    return {
        namespace: namespaceSelector(state),
        group: groupSelector(state),
        referenceData: referenceGroupDataSelector(state),
        languageData: languageGroupDataSelector(state),
        nameData: nameDataSelector(state),
        language: languageSelector(state),
        dataStatus: dataStatusSelector(state),
        examples: exampleDataSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        edit: (key, value) => dispatch(editTranslation(key, value)),
        editName: (key, type, value) => dispatch(editNameTranslation(key, type, value))
    }
}

const TranslatorEditor = props => {
    let {
        namespace,
        group,
        referenceData,
        languageData,
        nameData,
        dataStatus,
        language,
        examples,
        edit,
        editName
    } = props

    let keys = []
    if (namespace !== 'skillNames' && namespace !== 'itemNames') {
        referenceData.forEach((value, key) => {
            let exampleData = examples.get(key, null)
            let example = null
            if (exampleData) {
                example = (
                    <TranslatorExample
                        example={exampleData.get('example')}
                        referenceData={value}
                        languageData={languageData.get(key, '')}
                    />
                )
            }

            if (!key.endsWith('_plural')) {
                keys.push(
                    <div className="language-input-group" key={key}>
                        <p className="language-key">
                            <Badge
                                status={dataStatus.getIn([namespace, group, key], 'error')}
                                text={key}
                            />
                        </p>
                        <p className="language-reference">{value}</p>
                        <input
                            className="language-input"
                            value={languageData.get(key, '')}
                            onChange={e => edit(key, e.target.value)}
                        />
                        {example}
                    </div>
                )
            }
        })
    } else {
        nameData.forEach(data => {
            let key = data.get('_id')

            let url = ''
            if (namespace === 'skillNames') {
                url = 'https://static.bnstree.com/images/skills'
            } else {
                if (group.startsWith('SOULSHIELD')) {
                    url = 'https://static.bnstree.com/images/soulshields/sets/'
                } else {
                    url = 'https://static.bnstree.com/images/badges/'
                }
            }

            let ssEffect = null
            if (group === 'SOULSHIELD') {
                ssEffect = (
                    <div className="ssEffect">
                        <p className="language-key">set effect</p>
                        <p>{data.getIn(['effect', 'en'], '')}</p>
                        <input
                            className="language-input"
                            value={data.getIn(['effect', language], '')}
                            onChange={e => editName(key, 'effect', e.target.value)}
                        />
                    </div>
                )
            }

            keys.push(
                <div className="language-input-group" key={key}>
                    <div className="language-input-header">
                        <img alt={key} src={`${url}/${data.get('icon', 'blank')}`} />
                        <div>
                            <p className="language-key">
                                <Badge
                                    status={dataStatus.getIn([namespace, group, key], 'error')}
                                    text={key}
                                />
                            </p>
                            <p className="language-reference">{data.getIn(['name', 'en'], '')}</p>
                        </div>
                    </div>
                    <input
                        className="language-input"
                        value={data.getIn(['name', language], '') || ''}
                        onChange={e => editName(key, 'name', e.target.value)}
                    />
                    {ssEffect}
                </div>
            )
        })
    }

    return (
        <div className="translator-editor">
            {group && group !== 'none' ? (
                <h4>
                    {namespace !== 'skillNames' && namespace !== 'itemNames'
                        ? group.substr(3)
                        : group}{' '}
                    <small>{namespace}</small>
                </h4>
            ) : null}
            {keys}
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslatorEditor)
