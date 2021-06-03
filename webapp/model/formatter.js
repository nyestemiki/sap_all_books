sap.ui.define([], () => {
	'use strict'

	return {
		date(sTimestamp) {
			// return !!sTimestamp
			// 	? new Date(Number(sTimestamp.substring(6, sTimestamp.length - 2))).toDateString()
			// 	: 'No date'
			return sTimestamp
		}
	}
})
