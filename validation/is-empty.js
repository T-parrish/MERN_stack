// Returns true if the passed value is
// undefined || null || empty object || '' string
const isEmpty = (value) => (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0 )
);

module.exports = isEmpty