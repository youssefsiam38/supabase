import type { ErrorCode } from './error-codes.types'

const postgrestErrorCodes: ErrorCode[] = [
  {
    errorCode: '08*',
    statusCode: '503',
    description: 'pg connection err',
  },
  {
    errorCode: '09*',
    statusCode: '500',
    description: 'triggered action exception',
  },
  {
    errorCode: '0L*',
    statusCode: '403',
    description: 'invalid grantor',
  },
  {
    errorCode: '0P*',
    statusCode: '403',
    description: 'invalid role specification',
  },
  {
    errorCode: '23503',
    statusCode: '409',
    description: 'foreign key violation',
  },
  {
    errorCode: '23505',
    statusCode: '409',
    description: 'uniqueness violation',
  },
  {
    errorCode: '25006',
    statusCode: '405',
    description: 'read only sql transaction',
  },
  {
    errorCode: '25*',
    statusCode: '500',
    description: 'invalid transaction state',
  },
  {
    errorCode: '28*',
    statusCode: '403',
    description: 'invalid auth specification',
  },
  {
    errorCode: '2D*',
    statusCode: '500',
    description: 'invalid transaction termination',
  },
  {
    errorCode: '38*',
    statusCode: '500',
    description: 'external routine exception',
  },
  {
    errorCode: '39*',
    statusCode: '500',
    description: 'external routine invocation',
  },
  {
    errorCode: '3B*',
    statusCode: '500',
    description: 'savepoint exception',
  },
  {
    errorCode: '40*',
    statusCode: '500',
    description: 'transaction rollback',
  },
  {
    errorCode: '53*',
    statusCode: '503',
    description: 'insufficient resources',
  },
  {
    errorCode: '54*',
    statusCode: '413',
    description: 'too complex',
  },
  {
    errorCode: '55*',
    statusCode: '500',
    description: 'obj not in prerequisite state',
  },
  {
    errorCode: '57*',
    statusCode: '500',
    description: 'operator intervention',
  },
  {
    errorCode: '58*',
    statusCode: '500',
    description: 'system error',
  },
  {
    errorCode: 'F0*',
    statusCode: '500',
    description: 'config file error',
  },
  {
    errorCode: 'HV*',
    statusCode: '500',
    description: 'foreign data wrapper error',
  },
  {
    errorCode: 'P0001',
    statusCode: '400',
    description: 'default code for “raise”',
  },
  {
    errorCode: 'P0*',
    statusCode: '500',
    description: 'PL/pgSQL error',
  },
  {
    errorCode: 'XX*',
    statusCode: '500',
    description: 'internal error',
  },
  {
    errorCode: '42883',
    statusCode: '404',
    description: 'undefined function',
  },
  {
    errorCode: '42P01',
    statusCode: '404',
    description: 'undefined table',
  },
  {
    errorCode: '42501',
    statusCode: 'if authenticated 403, else 401',
    description: 'insufficient privileges',
  },
  {
    errorCode: 'other',
    statusCode: '400',
  },
  {
    errorCode: 'PGRST000',
    statusCode: '503',
    description:
      'Could not connect with the database due to an incorrectdb-uri or due to the PostgreSQL service not running.',
  },
  {
    errorCode: 'PGRST001',
    statusCode: '503',
    description: 'Could not connect with the database due to an internalerror.',
  },
  {
    errorCode: 'PGRST002',
    statusCode: '503',
    description:
      'Could not connect with the database when building theSchema Cache\ndue to the PostgreSQL service not running.',
  },
  {
    errorCode: 'PGRST003',
    statusCode: '504',
    description:
      'The request timed out waiting for a pool connectionto be available. See db-pool-acquisition-timeout.',
  },
  {
    errorCode: 'PGRST100',
    statusCode: '400',
    description:
      'Parsing error in the query string parameter.\nSee Horizontal Filtering, Operators and Ordering.',
  },
  {
    errorCode: 'PGRST101',
    statusCode: '405',
    description:
      'For functions, only GET and POST\nverbs are allowed. Any other verb will throw this error.',
  },
  {
    errorCode: 'PGRST102',
    statusCode: '400',
    description: 'An invalid request body was sent(e.g. an empty body or\nmalformed JSON).',
  },
  {
    errorCode: 'PGRST103',
    statusCode: '416',
    description: 'An invalid range was specified for Limits and Pagination.',
  },
  {
    errorCode: 'PGRST105',
    statusCode: '405',
    description: 'An invalid PUT request was done',
  },
  {
    errorCode: 'PGRST106',
    statusCode: '406',
    description:
      'The schema specified when\nswitching schemas is not present\nin the db-schemas configuration variable.',
  },
  {
    errorCode: 'PGRST107',
    statusCode: '415',
    description: 'The Content-Type sent in the request is invalid.',
  },
  {
    errorCode: 'PGRST108',
    statusCode: '400',
    description:
      'The filter is applied to a embedded resource that is not\nspecified in the select part of the query string.\nSee Embedded Filters.',
  },
  {
    errorCode: 'PGRST109',
    statusCode: '400',
    description:
      'Restricting a Deletion or an Update using limits must\ninclude the ordering of a unique column.\nSee Limited Update/Delete.',
  },
  {
    errorCode: 'PGRST110',
    statusCode: '400',
    description:
      'When restricting a Deletion or an Update using limits\nmodifies more rows than the maximum specified in the limit.\nSee Limited Update/Delete.',
  },
  {
    errorCode: 'PGRST111',
    statusCode: '500',
    description: 'An invalid response.headers was set.\nSee Response Headers.',
  },
  {
    errorCode: 'PGRST112',
    statusCode: '500',
    description: 'The status code must be a positive integer.\nSee Response StatuserrorCode.',
  },
  {
    errorCode: 'PGRST114',
    statusCode: '400',
    description: 'For an UPSERT using PUT, when\nlimits and offsets are used.',
  },
  {
    errorCode: 'PGRST115',
    statusCode: '400',
    description:
      'For an UPSERT using PUT, when the\nprimary key in the query string and the body are different.',
  },
  {
    errorCode: 'PGRST116',
    statusCode: '406',
    description:
      'More than 1 or no items where returned when requesting\na singular response. See Singular or Plural.',
  },
  {
    errorCode: 'PGRST117',
    statusCode: '405',
    description: 'The HTTP verb used in the request in not supported.',
  },
  {
    errorCode: 'PGRST118',
    statusCode: '400',
    description:
      'Could not order the result using the related table because\nthere is no many-to-one or one-to-one relationship between\nthem.',
  },
  {
    errorCode: 'PGRST119',
    statusCode: '400',
    description:
      'Could not use the spread operator on the related table\nbecause there is no many-to-one or one-to-one relationship\nbetween them.',
  },
  {
    errorCode: 'PGRST120',
    statusCode: '400',
    description:
      'An embedded resource can only be filtered using the\nis.null or not.is.null operators.',
  },
  {
    errorCode: 'PGRST121',
    statusCode: '400',
    description: 'PostgREST can’t parse the JSON objects in RAISE\nPGRST error. See raise headers.',
  },
  {
    errorCode: 'PGRST122',
    statusCode: '400',
    description:
      'Invalid preferences found in Prefer header with\nPrefer: handling=strict. See Strict or Lenient Handling.',
  },
  {
    errorCode: 'PGRST200',
    statusCode: '400',
    description:
      'Caused by stale foreign key relationships, otherwise any of\nthe embedding resources or the relationship itself may not\nexist in the database.',
  },
  {
    errorCode: 'PGRST201',
    statusCode: '300',
    description:
      'An ambiguous embedding request was made.\nSee Foreign Key Joins on Multiple Foreign Key Relationships.',
  },
  {
    errorCode: 'PGRST202',
    statusCode: '404',
    description:
      'Caused by a stale function signature, otherwise\nthe function may not exist in the database.',
  },
  {
    errorCode: 'PGRST203',
    statusCode: '300',
    description:
      'Caused by requesting overloaded functions with the same\nargument names but different types, or by using a POST\nverb to request overloaded functions with a JSON or\nJSONB type unnamed parameter. The solution is to rename\nthe function or add/modify the names of the arguments.',
  },
  {
    errorCode: 'PGRST204',
    statusCode: '400',
    description: 'Caused when the column specified\nin the columns query parameter is not found.',
  },
  {
    errorCode: 'PGRST300',
    statusCode: '500',
    description: 'A JWT secret is missing from the\nconfiguration.',
  },
  {
    errorCode: 'PGRST301',
    statusCode: '401',
    description:
      'Any error related to the verification of the JWT,\nwhich means that the JWT provided is invalid in some way.',
  },
  {
    errorCode: 'PGRST302',
    statusCode: '401',
    description:
      'Attempted to do a request without\nauthentication when the anonymous role\nis disabled by not setting it in db-anon-role.',
  },
  {
    errorCode: 'PGRSTX00',
    statusCode: '500',
    description: 'Internal errors related to the library used for connecting\nto the database.',
  },
]

export { postgrestErrorCodes }
