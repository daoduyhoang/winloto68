import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router';
import {api_request, upload_file} from './request';
import {format, getDetails, cutDai, initDetailByType} from './ticket'
const ethUtil = require('ethereumjs-util')

/**
 * Helper for React-Redux connect
 *
 * @param component
 * @param mapState - map state to props
 * @param mapDispatch - map dispatch to props
 */
export const createContainer = (component, mapState, mapDispatch=_.noop())=>{
    const tmp_mapState = (state, ownProps)=>{
        const s = {
            lang : state.language.language
        };

        return _.merge(s, mapState(state, ownProps));
    };
    return withRouter(connect(tmp_mapState, mapDispatch)(component));
};

export const constant = (moduleName, detailArray)=>{
    const result = {};
    _.each(detailArray, (detail)=>{
        result[detail] = `${moduleName}/${detail}`;
    });

    return result;
};

export const mmss = (endTime) => {
    if (!endTime) {
        return
    }

    endTime = Number(endTime.toString())
    const dateTime = new Date().getTime();
    const timestamp = Math.floor(dateTime / 1000);
    let secs = timestamp > endTime ? 0 : endTime - timestamp
    var minutes = Math.floor(secs / 60)
    secs = secs % 60
    return `${pad(minutes)}:${pad(secs)}`;
    // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}

export const miniAddressSummary = (address) => {
  if (!address || address.length<10) return address
  var checked = checksumAddress(address)
  return checked ? checked.slice(0, 4) + '...' + checked.slice(-4) : '...'
}

export const isValidAddress = (address) => {
  var prefixed = ethUtil.addHexPrefix(address)
  if (address === '0x0000000000000000000000000000000000000000') return false
  return (isAllOneCase(prefixed) && ethUtil.isValidAddress(prefixed)) || ethUtil.isValidChecksumAddress(prefixed)
}

export const addressSummary = (address, firstSegLength = 10, lastSegLength = 4, includeHex = true) => {
  if (!address) return ''
  let checked = checksumAddress(address)
  if (!includeHex) {
    checked = ethUtil.stripHexPrefix(checked)
  }
  return checked ? checked.slice(0, firstSegLength) + '...' + checked.slice(checked.length - lastSegLength) : '...'
}

function checksumAddress (address) {
  const checksummed = address ? ethUtil.toChecksumAddress(address) : ''
  return checksummed
}

export {
    initDetailByType,
    getDetails,
    format,
    cutDai,
    api_request,
    upload_file
};
