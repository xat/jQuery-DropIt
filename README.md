# jQuery DropIt

DropIt is a jQuery plugin which lets you drop html and image files in
your browser and let them render inside of html elements.
It uses the HTML5 File API and currently works with the latest chrome and firefox versions.

## Usage

    // JS
    $('.dropzone').dropIt();

    //HTML
    <body class="dropzone"></body>

You can now drag html snippets and images from your filesystem and drop them into the body element.
They will get rendered directly. The html-snippets you drop can contain html elements with class='dropzone'
themselves so you then can drop snippets into them again and so on... To remove dropped snippets simply
doubleclick them.

By default the snippets you drop append the existing snippets in the document. You can change
this behavour like this:

    <body class="dropzone" data-dropit-insert-mode="overwrite"></body>

The Snippets inside the body will get overwritten from now on. If you want 'overwrite'
to be the default insert-mode initialize the plugin with {defaultInsertMode: 'overwrite'}.
Valid insert modes are: append, prepend and overwrite.

Okay, atm you can just drop any snippet into the dropzone areas. But there are situations
you want to limitate whats allowed to get dropped. For example you have an unorderd list
where you want to allow 'li' elements to get dropped in. This is how you handle it:

    <ul class="dropzone" data-dropit-accept=">li"></ul>

Every snippet dropped into this dropzone will now get matched against the ">li" selector . If they dont match
they will get rejected. This also works the other way around:

    <ul class="dropzone" data-dropit-reject=">li"></ul>

I know, this example dosnt make big sense... but in this case you could drop anything except li-elements.
