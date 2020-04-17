const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {getFieldErrorMessage} = require('../../utils/errorUtils');
const {LIST_OF_ROLES, USER_ROLE} = require('../../rbac/roles');

const {Schema} = mongoose;

const UserSchema = new Schema({
    login: {
        type: String,
        required: [true, getFieldErrorMessage('логин')],
        unique: true,
        minlength: 2,
        maxlength: 20,
    },
    password: {
        type: String,
        required: [true, getFieldErrorMessage('пароль')],
        minlength: 8,
        select: false,
    },
    passwordChangedAt: Date,
    passwordConfirm: {
        type: String,
        required: [true, getFieldErrorMessage('повторный пароль')],
        validate: {
            validator: function (field) {
                return field === this.password;
            },
            message: 'Введенные пароли не совпадают',
        },
    },
    email: {
        type: String,
        required: [true, getFieldErrorMessage('e-mail')],
        unique: true,
        lowercase: true,
        validate: [
            validator.isEmail,
            'Введите корректный адрес электронной почты',
        ],
    },
    phone: {
        type: String,
        validate: {
            validator: function (field) {
                return validator.isMobilePhone(
                    field,
                    validator.isMobilePhoneLocales['ru-RU'],
                );
            },
            message: 'Введите корректный номер телефона',
        },
    },
    role: {
        type: String,
        enum: LIST_OF_ROLES,
        default: USER_ROLE,
    },
    building: {
        type: Schema.ObjectId,
        ref: 'Building',
        required: [true, getFieldErrorMessage('здание')],
    },
    favouriteRooms: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Room',
        },
    ],
    photo: String,
    name: String,
    surname: String,
    patronymic: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
    },
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcript.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

/**
 * Проверка введенного пароля на соответствие паролю пользователя.
 *
 * @param {string} enteredPassword Введенный пароль.
 * @param {string} userPassword Пароль пользователя.
 *
 * @returns {Promise<Boolean>} Промис с результатом проверки.
 */
UserSchema.methods.checkPassword = function (enteredPassword, userPassword) {
    return bcript.compare(enteredPassword, userPassword);
};

/**
 * Получить JWT токен.
 *
 * @param {object} user Данные пользователя.
 *
 * @returns {string} JWT токен.
 */
UserSchema.methods.getToken = function (user) {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * Проверить, что смена пароля произошла после.
 *
 * @param {timestamp} timestamp Таймштамп для проверки.
 */
UserSchema.methods.passwordChangedAfter = function (timestamp) {
    if (this.passwordChangedAt && timestamp) {
        const passwordTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );

        return timestamp < passwordTimestamp;
    }

    return false;
};

/**
 * Получить токен восстановления пароля.
 */
UserSchema.methods.getResetToken = function () {
    const token = crypto.randomBytes(32).toString('hex');

    return token;
};

/**
 * Добавить данные по токену восстановления пароля пользователю.
 *
 * @param {string} token Токен для восстановления пароля.
 *
 * @returns {UserSchema} UserSchema object.
 */
UserSchema.methods.setTokensInfo = function (token) {
    if (!token) return;

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return this;
};

/**
 * Сбросить данные по токену восстановления пароля пользователю.
 */
UserSchema.methods.clearTokensInfo = function () {
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;

    return this;
};

module.exports = UserSchema;
