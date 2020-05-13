exports.replaceInTemplate = (tpl, data) => {
    let result = tpl;
    console.log(tpl);

    Object.keys(data).forEach((key) => {
        result = result.replace(new RegExp(`{{${key}}}`, 'gi'), data[key]);
    });

    return result;
};
