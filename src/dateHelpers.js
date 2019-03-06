import moment from 'moment';

/**
 * Various handy date-related functions.
 */

export function convertToUtc(date) {
    return moment(date).utc().format('YYYY-MM-DDThh:mm');
}

export function convertFromUtc(date) {
    return moment.utc(date).local().format('YYYY-MM-DDThh:mm');
}

export function getDateFromDateTime(currentDate) {
    return currentDate.split('T')[0];
}