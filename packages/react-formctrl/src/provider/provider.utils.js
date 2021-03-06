export function ensureStringValue(value, type) {
    if(value && (type === 'date' || type === 'datetime-local')) {
        if(value instanceof Date) {
            if(type === 'date') {
                return formatDate(value)
            } else {
                return formatDateTime(value)
            }
        } else if (typeof value === 'string') {
            if(new Date(value) == 'Invalid Date') {
                throw `The value "${value}" provided can't be parsed to date type.`
            }
        } else if(typeof value === 'number') {
            const dateObj = new Date(value)
            if(dateObj != 'Invalid Date') {
                if(type === 'date') {
                    return formatDate(dateObj)
                } else {
                    return formatDateTime(dateObj)
                }
            } else {
                throw `The value "${value}" provided can't be parsed to date type.`
            }
        }
    }
    return value;
}

export function formatDate(date) {
    if(date && date instanceof Date) {
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
        const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
        return `${date.getFullYear()}-${month}-${day}`
    }
    return date;
}

export function formatDateTime(date) {
    if(date && date instanceof Date) {
        const months = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
        const days = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
        return `${date.getFullYear()}-${months}-${days}T${hours}:${minutes}`
    }
    return date;
}

export function dispatchEvent(type, payload) {
    const event = document.createEvent('CustomEvent')
    event.initCustomEvent(type, false, false, payload)
    document.dispatchEvent(event)
}

export function copyFiles(selectedFiles) {
    if (selectedFiles) {
        if (Array.isArray(selectedFiles)) {
            return copyArray(selectedFiles)
        } else {
            const files = []
            for (var i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles.item(i)
                files.push(file)
            }
            return files
        }
    }
    return []
}

export function copyArray(array) {
    if (array) {
        return array.map(item => item)
    }
    return []
}

export function copyFieldCtrlProps(props) {
    return {
        name: props.name,
        form: props.form,
        type: props.type,
        required: props.required,
        pattern: props.pattern,
        match: props.match,
        integer: props.integer,
        min: props.min,
        max: props.max,
        minLength: props.minLength,
        maxLength: props.maxLength,
        accept: props.accept,
        extensions: copyArray(props.extensions),
        maxSize: props.maxSize,
        validate: props.validate
    }
}

export function copyError(error) {
    const output = {
        key: error.key
    }
    if (error.params) {
        const params = {}
        Object.keys(error.params).forEach(paramName => {
            const param = error.params[paramName]
            if (Array.isArray(param)) params[paramName] = copyArray(param)
            else if (typeof param.item === 'function') params[paramName] = copyFiles(param)
            else params[paramName] = param
        })
        output.params = params
    } else {
        output.params = undefined
    }
    return output
}

export function copyErrors(errors) {
    if (errors && errors.length) {
        return errors.map(error => copyError(error))
    }
    return errors
}

export function copyFieldCtrl(fieldCtrl) {
    if (fieldCtrl) {
        return {
            __instances: fieldCtrl.__instances,
            validating: fieldCtrl.validating,
            valid: fieldCtrl.valid,
            invalid: fieldCtrl.invalid,
            untouched: fieldCtrl.untouched,
            touched: fieldCtrl.touched,
            pristine: fieldCtrl.pristine,
            dirty: fieldCtrl.dirty,
            unchanged: fieldCtrl.unchanged,
            changed: fieldCtrl.changed,
            errors: copyErrors(fieldCtrl.errors),
            value: fieldCtrl.value,
            files: fieldCtrl.files,
            initialValue: fieldCtrl.initialValue,
            props: copyFieldCtrlProps(fieldCtrl.props)
        }
    }
}

export function copyFormValues(values) {
    const cValues = {}
    if (values) {
        const fieldsNames = Object.keys(values)
        if (fieldsNames.length) {
            fieldsNames.forEach(fieldName => {
                cValues[fieldName] = values[fieldName]
            })
        }
    }
    return cValues
}

export function copyFormFiles(files) {
    const cFiles = {}
    if (files) {
        const fieldsNames = Object.keys(files)
        if (fieldsNames.length) {
            fieldsNames.forEach(fieldName => {
                cFiles[fieldName] = copyFiles(files[fieldName])
            })
        }
    }
    return cFiles
}

export function copyFormFields(fields) {
    const cFields = {}
    if (fields) {
        const fieldsNames = Object.keys(fields)
        if (fieldsNames.length) {
            fieldsNames.forEach(fieldName => {
                cFields[fieldName] = copyFieldCtrl(fields[fieldName])
            })
        }
    }
    return cFields
}

export function copyFormCtrl(formCtrl) {
    if (formCtrl) {
        return {
            __instances: formCtrl.__instances,
            formName: formCtrl.formName,
            validating: formCtrl.validating,
            valid: formCtrl.valid,
            invalid: formCtrl.invalid,
            untouched: formCtrl.untouched,
            touched: formCtrl.touched,
            pristine: formCtrl.pristine,
            dirty: formCtrl.dirty,
            unchanged: formCtrl.unchanged,
            changed: formCtrl.changed,
            fields: copyFormFields(formCtrl.fields),
            values: copyFormValues(formCtrl.values),
            files: copyFormFiles(formCtrl.files),
        }
    }
}

export function comparePatterns(pattern1, pattern2) {
    if (pattern1 === pattern2) return true
    if (pattern1 && pattern2) return pattern1.toString() === pattern2.toString()
    return false
}

export function compareFieldProps(props1, props2) {
    if (props1 === props2) return true
    if (props1.name !== props2.name) return false
    if (props1.form !== props2.form) return false
    if (props1.type !== props2.type) return false
    if (props1.required !== props2.required) return false
    if (!comparePatterns(props1.pattern, props2.pattern)) return false
    if (props1.match !== props2.match) return false
    if (props1.integer !== props2.integer) return false
    if (props1.min != props2.min) return false
    if (props1.max != props2.max) return false
    if (props1.minLength != props2.minLength) return false
    if (props1.maxLength != props2.maxLength) return false
    if (props1.accept !== props2.accept) return false
    if (!compareArrays(props1.extensions, props2.extensions)) return false
    if (props1.maxSize != props2.maxSize) return false
    if (!compareArrays(props1.validate, props2.validate)) return false
    return true
}

export function compareArrays(array1, array2) {
    if ((array1 && !array2) || (!array1 && array2)) return false;
    if (typeof array1 !== typeof array2) return false
    if (Array.isArray(array1) !== Array.isArray(array2)) return false
    if (array1 === array2) return true

    if (Array.isArray(array1) && Array.isArray(array2)) {

        // compare lengths - can save a lot of time 
        if (array1.length != array2.length)
            return false;

        for (var i = 0, l = array1.length; i < l; i++) {
            // Check if we have nested arrays
            if (array1[i] instanceof Array && array2[i] instanceof Array) {
                // recurse into the nested array2s
                if (!compareArrays(array1[i], array2[i]))
                    return false;
            }
            else if (array1[i] != array2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }
    return false;
}