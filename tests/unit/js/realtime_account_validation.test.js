const { JSDOM } = require('jsdom');
const $ = require('jquery');

const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>');
global.window = dom.window;
global.document = window.document;

function validatePasswords() {
    var value = document.getElementById('password').value;
    var value2 = document.getElementById('password2').value;
    if (value && value2) {
        if (value2 === value) {
            $('#password2Message').removeClass().addClass('darkgreen').text('');
            $('label[for="password2"]').removeClass();
            $(document.getElementById('password2')).removeClass().addClass('required');
        }
        else {
            $(document.getElementById('password2')).removeClass().addClass('required invalid');
            $('label[for="password2"]').removeClass().addClass('invalid');
            $('#password2Message').removeClass().addClass('invalid').text('Passwords didnt match');
        }
    }
    else {
        $('label[for="password2"]').removeClass();
        $(document.getElementById('password2')).removeClass().addClass('required');
        $('#password2Message').removeClass().text('');
    }
}

$('#username').on('blur', validateUsername);
$('#emailAddr').on('blur', validateEmail);
$('#password, #password2').on('blur', validatePasswords);

$('#signup').on('click', function(e) {
    e.preventDefault();
    if (! (window.grecaptcha && window.grecaptcha.getResponse().length)) {
        alert(ugettext('Please complete all fields and click the reCAPTCHA checkbox before proceeding.'));
        return;
    }
    validateEmail();
    validateUsername();
    validatePasswords();
    $(this).closest('form').trigger('submit');
});


test('validatePasswords: both passwords match', () => {
    $('#password').val('password123');
    $('#password2').val('password123');
    validatePasswords();
    expect($('#password2').hasClass('required')).toBe(true);
    expect($('#password2').hasClass('invalid')).toBe(false);
    expect($('#password2Message').text()).toBe('');
});

test('validatePasswords: passwords do not match', () => {
    $('#password').val('password123');
    $('#password2').val('password456');
    validatePasswords();
    expect($('#password2').hasClass('required')).toBe(true);
    expect($('#password2').hasClass('invalid')).toBe(true);
    expect($('#password2Message').text()).toBe('Passwords didnt match');
});

test('validatePasswords: one or both passwords are empty', () => {
    $('#password').val('');
    $('#password2').val('');
    validatePasswords();
    expect($('#password2').hasClass('required')).toBe(true);
    expect($('#password2').hasClass('invalid')).toBe(false);
    expect($('#password2Message').text()).toBe('');
});
