self.port.on('show', function (data) {
    var list = document.getElementById('values')
    list.innerHTML = '';
    data.pref.values.map(function (value) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(value));
        if (value === data.selected) {
            li.setAttribute('class', 'selected')
        } else {
            li.addEventListener('click', function(event) {
                self.port.emit('selected', {
                    index: data.pref.index,
                    value: value
                });
            });
        }
        list.appendChild(li);
    });
});