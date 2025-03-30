import React, { useState } from 'react';
import JoditEditor from 'jodit-react';

function TextEditor() {
  const [content, setContent] = useState('');

  const handleChange = (newContent) => {
    setContent(newContent);
  };

  const config = {
    readonly: false, // set to true for readonly mode
    height: 400, // set the height of the editor
  };

  return (
    <div>
      <JoditEditor
        value={content}
        config={config}
        onBlur={handleChange} // on blur event (when you leave the editor)
        onChange={handleChange} // on content change event
      />
    </div>
  );
}

export default TextEditor;
