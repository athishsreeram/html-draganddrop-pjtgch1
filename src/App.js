import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [items, setItems] = useState([
    {
      id: 1,
      label: 'Heading',
      content: '<h2 id="heading" class="heading-class" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; color: red; text-align: left; line-height: 1.5;">Heading Text</h2>',
    },
    {
      id: 2,
      label: 'Text Content',
      content: '<p id="text" class="text-class" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 16px; color: black; text-align: left; line-height: 1.5; background-color: lightblue; padding: 10px;">More text content</p>',
    },
    {
      id: 3,
      label: 'Image',
      content: '<img id="image" class="image-class" src="https://via.placeholder.com/150" alt="Yet Another Image" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 16px; color: black; text-align: left; line-height: 1.5; border: 1px solid black; border-radius: 50%;" />',
    },
    {
      id: 4,
      label: 'Two Column Layout',
      content: `
        <div class="two-column-layout" id="two-column-layout-1">
          <div class="column" id="column-left-1" ">
          <img id="image" class="image-class" src="https://via.placeholder.com/150" alt="Yet Another Image" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 16px; color: black; text-align: left; line-height: 1.5; border: 1px solid black; border-radius: 50%;" />
          </div>
          <div class="column" id="column-right-1" ">
          <img id="image" class="image-class" src="https://via.placeholder.com/150" alt="Yet Another Image" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 16px; color: black; text-align: left; line-height: 1.5; border: 1px solid black; border-radius: 50%;" />
          </div>
        </div>
      `,
    },    
    {
      id: 5,
      label: 'Three Column Layout',
      content: `
        <div class="three-column-layout">
          <div class="column">
            <p>First Column Content</p>
          </div>
          <div class="column">
            <p>Second Column Content</p>
          </div>
          <div class="column">
            <p>Third Column Content</p>
          </div>
        </div>
      `,
    },
  ]);

  const [leftSideItems, setLeftSideItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [leftItemIdCounter, setLeftItemIdCounter] = useState(1);
  const [editableAttributes, setEditableAttributes] = useState([]);

  // State variables for Edit Style
  const [headingType, setHeadingType] = useState('h2');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontSize, setFontSize] = useState('24px');
  const [color, setColor] = useState('red');
  const [textAlign, setTextAlign] = useState('left');
  const [lineHeight, setLineHeight] = useState('1.5');

  useEffect(() => {
    if (selectedItem) {
      // Extract editable attributes from the selected item's content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = selectedItem.content;
      const attributes = [];
      if (tempDiv.firstChild) {
        const element = tempDiv.firstChild;
        if (element.attributes) {
          for (let attr of element.attributes) {
            attributes.push({ name: attr.name, value: attr.value });
          }
        }
      }
      setEditableAttributes(attributes);
    }
  }, [selectedItem]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDropLeft = (e) => {
    const itemId = e.dataTransfer.getData('text/plain');
    const item = items.find((item) => item.id === Number(itemId));
    const newItem = {
      id: leftItemIdCounter,
      label: item.label,
      content: item.content,
    };
    setLeftItemIdCounter(leftItemIdCounter + 1);
    setLeftSideItems((prevItems) => [...prevItems, newItem]);
  };

  const handleDropIntoColumn = (e, columnId) => {
    const itemId = e.dataTransfer.getData('text/plain');
    const item = items.find((item) => item.id === Number(itemId));
    const columnIndex = leftSideItems.findIndex((item) => item.id === columnId);
    if (columnIndex !== -1) {
      const updatedLeftSideItems = [...leftSideItems];
      updatedLeftSideItems[columnIndex].content += item.content;
      setLeftSideItems(updatedLeftSideItems);
    }
  };

  const handleItemClick = (itemId) => {
    const item = leftSideItems.find((item) => item.id === itemId);
    setSelectedItem(item);
    setEditedContent(item.content);
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSave = () => {
    // Construct the updated content with the edited style properties
    let updatedContent = editedContent;

    if (selectedItem) {
      // Parse the existing content to manipulate its style
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editedContent;

      // Ensure there's a first child element
      if (tempDiv.firstChild) {
        const element = tempDiv.firstChild;

        // Check if the element has style properties
        if (element.style) {
          // Update style properties based on user input
          element.style.fontFamily = fontFamily;
          element.style.fontWeight = fontWeight;
          element.style.fontSize = fontSize;
          element.style.color = color;
          element.style.textAlign = textAlign;
          element.style.lineHeight = lineHeight;

          // Update the edited content with the modified style
          updatedContent = tempDiv.innerHTML;
        } else {
          console.error('Element does not have style properties.');
        }
      } else {
        console.error('No child element found.');
      }
    }

    // Save the updated content to the left side items
    setLeftSideItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItem.id
          ? { ...item, content: updatedContent }
          : item
      )
    );

    // Clear selected item and edited content
    setSelectedItem(null);
    setEditedContent('');
  };

  const handleDelete = (itemId) => {
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(null);
      setEditedContent('');
    }
    setLeftSideItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAttributeChange = (e, index) => {
    const newAttributes = [...editableAttributes];
    newAttributes[index].value = e.target.value;
    setEditableAttributes(newAttributes);

    // Update editedContent with the changes in attributes
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editedContent;
    if (tempDiv.firstChild) {
      const element = tempDiv.firstChild;
      element.setAttribute(newAttributes[index].name, e.target.value);
      setEditedContent(tempDiv.innerHTML);
    }
  };

  return (
    <div className="App">
      <h1>Drag and Drop HTML Components</h1>
      <div className="drop-container">
        <div
          onDrop={handleDropLeft}
          onDragOver={handleDragOver}
          className="drop-space"
        >
          <h2>Left Drop Space</h2>
          {leftSideItems.map((item) => (
            <div key={item.id} className="dropped-item">
              <div className="top-right-icons">
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={() => handleItemClick(item.id)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => handleDelete(item.id)}
                />
              </div>
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </div>
          ))}
        </div>
        <div className="component-list">
          <h2>Component List</h2>
          {items.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              className="draggable-item"
            >
              <div className="item-label">{item.label}</div>
            </div>
          ))}

          {selectedItem && (
            <div className="editor">
              <h2>Edit Content</h2>
              <textarea value={editedContent} onChange={handleContentChange} rows="20" cols="50" />
              <h3>Edit Attributes:</h3>
              <ul>
                {editableAttributes.map((attr, index) => (
                  <li key={index}>
                    <strong>{attr.name}:</strong>{' '}
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(e, index)}
                    />
                  </li>
                ))}
              </ul>
              <h3>Edit Style:</h3>
              <ul>
                <li>
                  <label htmlFor="headingType">Heading Type:</label>
                  <select
                    id="headingType"
                    value={headingType}
                    onChange={(e) => setHeadingType(e.target.value)}
                  >
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    {/* Add more options as needed */}
                  </select>
                </li>
                <li>
                  <label htmlFor="fontFamily">Font Family:</label>
                  <input
                    type="text"
                    id="fontFamily"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                  />
                </li>
                <li>
                  <label htmlFor="fontWeight">Font Weight:</label>
                  <input
                    type="text"
                    id="fontWeight"
                    value={fontWeight}
                    onChange={(e) => setFontWeight(e.target.value)}
                  />
                </li>
                <li>
                  <label htmlFor="fontSize">Font Size:</label>
                  <input
                    type="text"
                    id="fontSize"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                  />
                </li>
                <li>
                  <label htmlFor="color">Color:</label>
                  <input
                    type="color"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </li>
                <li>
                  <label htmlFor="textAlign">Text Align:</label>
                  <select
                    id="textAlign"
                    value={textAlign}
                    onChange={(e) => setTextAlign(e.target.value)}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </li>
                <li>
                  <label htmlFor="lineHeight">Line Height:</label>
                  <input
                    type="text"
                    id="lineHeight"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(e.target.value)}
                  />
                </li>
              </ul>

              <button onClick={handleSave}>Save</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
