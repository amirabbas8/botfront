import SimpleSchema from 'simpl-schema';

export const UserEditSchema = new SimpleSchema({
    _id: { type: String },
    emails: Array,
    'emails.$': Object,
    'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
    'emails.$.verified': { type: Boolean, autoValue: true },
    profile: Object,
    'profile.firstName': { type: String },
    'profile.lastName': { type: String },
    'profile.lang': { type: String, autoValue: 'en' },
}, { tracker: Tracker });

export const UserCreateSchema = new SimpleSchema({
    profile: Object,
    'profile.firstName': { type: String },
    'profile.lastName': { type: String },
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    sendEmail: { type: Boolean, defaultValue: true },
    'profile.lang': { type: String, autoValue: 'en' },
}, { tracker: Tracker });
