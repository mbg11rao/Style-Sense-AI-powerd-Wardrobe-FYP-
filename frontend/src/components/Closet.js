import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';
import ClothContainer from './ClothContainer'
import '../styles/Closet.css'
import { delete_selected } from '../styles/icons.js'
import { getClothByTypeEvent, uploadPhotoAPI, dbobj2obj } from '../api/api.js'
import AddClothPopUp from './AddClothPopUp.js';
import Footbar from './Footbar';

function Closet() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activity = queryParams.get('activity');
  const selectedDate = queryParams.get('selectedDate');

  const initialSelectedChoices = activity ? ['All', dbobj2obj[activity]] : ['All'];

  const [selectedChoices, setSelectedChoices] = useState(initialSelectedChoices)
  const [displayEventButtons, setDisplayEventButtons] = useState(activity !== null)
  const [clothTypeUrls, setClothTypeUrls] = useState([])
  const [renderIndex, setRenderIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAddClothPopUpOpen, setIsAddClothPopUpOpen] = useState(false);
  const [selectedFileImage, setselectedFileImage] = useState(false);

  const eventTypes = [
    'Workout',
    'Formal Events',
    'Meeting',
    'Outdoor',
    'Night Out',
    'Causal'
  ]

  const clothType = [
    'All',
    'Top',
    'Bottom',
    'Full Body',
    'Outwear',
    'Shoes',
    'Accessory'
  ]

  useEffect(() => {
    // Fetch image URLs based on selected choices
    async function fetchClothUrls() {
      // find the first event type in selectedChoices
      const selectedEvent = selectedChoices.find(choice =>
        eventTypes.includes(choice)
      )
      // find the first clothing type in selectedChoices
      const selectedClothType = selectedChoices.find(choice =>
        clothType.includes(choice)
      )
      const urls = await getClothByTypeEvent(
        selectedClothType || 'all',
        selectedEvent || 'null'
      )
      setClothTypeUrls(urls)
    }
    fetchClothUrls()
  }, [selectedChoices])

  useEffect(() => {
    // Delay rendering the ClothContainer components
    const timeout = setTimeout(() => {
      setRenderIndex(renderIndex + 6)
    }, 1000) // Adjust the delay time (in milliseconds) as needed

    return () => clearTimeout(timeout)
  }, [renderIndex])

  const handleChoiceClick = choice => {
    // Check if the selected choice is a clothing type
    if (clothType.includes(choice)) {
      // Replace the selected clothing type with the new choice
      const updatedChoices = selectedChoices.map(currentChoice =>
        clothType.includes(currentChoice) ? choice : currentChoice
      )
      setSelectedChoices(updatedChoices)
      // setDisplayEventButtons(true)
    } else {
      // Check if there's an event type already selected
      const eventTypeIndex = selectedChoices.findIndex(currentChoice =>
        eventTypes.includes(currentChoice)
      )

      if (eventTypeIndex !== -1) {
        // Replace the existing event type with the new choice
        const updatedChoices = [...selectedChoices]
        updatedChoices.splice(eventTypeIndex, 1, choice)
        setSelectedChoices(updatedChoices)
      } else {
        // Add the new choice (event type) to selectedChoices
        setSelectedChoices([...selectedChoices, choice])
      }
    }
  }

  const handleAddClothes = () => {
    // Check if the user is on an iPhone
    const isIPhone = /iPhone/i.test(navigator.userAgent)
    console.log(isIPhone)
    console.log(navigator)
    if (isIPhone) {
      console.log('HERE')
      // If on iPhone, open the camera
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          // Use the stream for your camera functionality
          console.log('Camera opened on iPhone')
          console.log(stream)
        })
        .catch(error => {
          console.error('Error opening the camera:', error)
        })
    } else {
      // If not on iPhone, trigger the file input element
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.click()

      fileInput.addEventListener('change', async event => {
        const selectedFile = event.target.files[0]
        if (selectedFile) {
          setSelectedImage(URL.createObjectURL(selectedFile)); // Set the selected image in the state
          setIsAddClothPopUpOpen(true); // Open the AddClothPopUp
          setselectedFileImage(selectedFile);
          // await uploadPhotoAPI(selectedFile);
          // setRenderIndex(0);
          console.log('Uploaded file:', selectedFile)
        }
      })
    }
  }

  const closeAddClothPopUp = () => {
    setIsAddClothPopUpOpen(false);
  };


  const handleRemoveChoice = choice => {
    if (choice === 'All') {
      return
    }
    const updatedChoices = selectedChoices.filter(c => c !== choice)
    // if selectedChoices is empty, add 'All' back
    if (selectedChoices.length === 0) {
      setSelectedChoices(['All'])
    }
    if (clothType.includes(choice)) {
      setDisplayEventButtons(false)
      setSelectedChoices(['All', ...updatedChoices])
    } else {
      setSelectedChoices(updatedChoices)
    }
  }

  const showEventButtons = () => {
    setDisplayEventButtons(true)
  }

  const showTypeButtons = () => {
    setDisplayEventButtons(false)
  }

  if (isAddClothPopUpOpen) {
    return ReactDOM.createPortal(
      <AddClothPopUp selectedFile={selectedFileImage} selectedImage={selectedImage} onClose={closeAddClothPopUp} eventTypes={eventTypes} clothType={clothType} forEdit={false} />,
      document.getElementById('root-portal')
    );
  }


  return (
    <div className='closet'>
      <div className='top-row-frame'>
        <div className='my-closet-title'>My Closet</div>
        <button className='add-button' onClick={handleAddClothes}>
          + Add Clothes
        </button>
      </div>
      <div className='search-bar-frame'>
        <div className='input-bar'>
          <div className='input-bar-selection-part'>
            {(selectedChoices.length === 1) & (selectedChoices[0] === 'All') ? (
              <div className='all-selected-placeholder'>Select...</div>
            ) : (
              selectedChoices.map(choice => {
                if (choice === 'All') {
                  return <></>
                }
                return (
                  <button
                    key={choice}
                    className='selected-choice-button'
                    onClick={() => handleRemoveChoice(choice)}
                  >
                    {choice}
                    {delete_selected}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
      <div className='type-event'>
        <button
          className={`type-event-button ${displayEventButtons ? 'fw-400' : 'fw-600'
            }`}
          onClick={showTypeButtons}
        >
          Type
        </button>
        <div className='type-event-button'> | </div>
        <button
          className={`type-event-button ${displayEventButtons ? 'fw-600' : 'fw-400'
            }`}
          onClick={showEventButtons}
        >
          Activity
        </button>
      </div>
      <div className='selection-fields-container'>
        {displayEventButtons && (
          <div className='selection-fields'>
            {eventTypes.map(choice => {
              return (
                <button
                  key={choice}
                  className={`${selectedChoices.includes(choice) ? 'selected' : 'unselected'
                    }-choice-button`}
                  onClick={() => handleChoiceClick(choice)}
                >
                  {choice}
                </button>
              )
            })}
          </div>
        )}
        {!displayEventButtons && (
          <div className='selection-fields'>
            {clothType.map(choice => {
              return (
                <button
                  key={choice + '1'}
                  className={`${selectedChoices.includes(choice) ? 'selected' : 'unselected'
                    }-choice-button`}
                  onClick={() => handleChoiceClick(choice)}
                >
                  {choice}
                </button>
              )
            })}
          </div>
        )}
      </div>
      <div className='all-clothes-container'>
        {clothTypeUrls.slice(0, renderIndex).map((element, index) => (
          <ClothContainer
            key={index}
            brand_name={element.brand_name}
            descriptions={element.descriptions}
            event={element.event}
            imageUrl={element.image_urls}
            type={element.type}
            mongoID={element._id}
            eventTypes={eventTypes}
            clothType={clothType}
            activity={activity}
            selectedDate={selectedDate}
            selectedChoices={selectedChoices}
          />
        ))}
      </div>
      <Footbar />
    </div>
  )
}

export default Closet
