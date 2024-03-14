import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Menu, SubMenu, Input, Icon } from 'antd'
import MediaQuery from "react-responsive"
import I18N from '@/I18N'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { Affix, Radio, Badge, Tooltip } from 'antd';
import './style.scss'
import _ from 'lodash'

export default class extends BaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            value: props.value || ''
        }
      }

    handleChangeStartAddress = value => {
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(value)
        }
        this.setState({value})
    }

    clearData() {
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange('')
        }
        this.setState({
            value: ''
        })
    }

    handleSelectStartAddress = (value, placeId) => {
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(value, placeId)
        }

        this.setState({value})
        geocodeByAddress(value)
          .then(results => getLatLng(results[0]))
    }

    searchChangedEnter(e) {
        if (_.isFunction(this.props.onPressEnter)) {
            this.props.onPressEnter(e.target.value)
        }

        this.setState({
            value: e.target.value
        })
        geocodeByAddress(e.target.value)
          .then(results => getLatLng(results[0]))
    }

    ord_render () {
        return (
            <PlacesAutocomplete
                value={this.state.value}
                onChange={this.handleChangeStartAddress}
                onSelect={this.handleSelectStartAddress}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div>
                    <Input
                      {...getInputProps({
                        className: 'location-search-input',
                      })}
                      size={this.props.size}
                      disabled={this.props.disabled}
                      value={this.state.value}
                      defaultValue={this.props.defaultValue}
                      placeholder={this.props.placeholder}
                      prefix={this.props.prefix}
                      suffix={this.state.value && (<span className="clear-data" onClick={this.clearData.bind(this)}><Icon type="close" /></span>)}
                      onPressEnter={this.searchChangedEnter.bind(this)}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div className="suggestion-item-autocomplete">Loading...</div>}
                      {suggestions.map(suggestion => {
                        const className = suggestion.active
                          ? 'suggestion-item-autocomplete--active'
                          : 'suggestion-item-autocomplete';
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? { backgroundColor: '#c10960', color: '#fff', cursor: 'pointer' }
                          : { backgroundColor: '#ffffff', cursor: 'pointer' };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                          >
                            <p className="suggestion-item-desc">{suggestion.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </PlacesAutocomplete>
        )
    }
}
