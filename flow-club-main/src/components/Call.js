import DailyIframe from '@daily-co/daily-js'
import { child, onValue, set, update } from '@firebase/database'
import { useEffect, useRef, useState, useCallback } from 'react'
import { dailyParticipantInfo, makeParticipantUpdateHandler } from '../utils/daily'
import { firebaseSlugBase } from '../utils/firebase'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { getRoomUrl } from '../utils/room'
import ToDoList from './ToDo/ToDoList'
import ToDoAdd from './ToDo/ToDoAdd'
import './Call.css'


function Call({ firebaseApp }) {
    const callWrapperEl = useRef(null)
    const [participants, setParticipants] = useState({})

    const callFrame = useRef(null)
    useEffect(() => {
        const roomUrl = getRoomUrl()
        const frame = DailyIframe.createFrame(
            callWrapperEl.current,
            {
                url: roomUrl
            }
        )

        callFrame.current = frame
        frame.join()
            .then(frameParticipants => {
                let newParticipants = {}
                for (const [id, participant] of Object.entries(frameParticipants)) {
                    newParticipants[id] = dailyParticipantInfo(participant)
                }
                setParticipants(newParticipants)
            })

        frame.on('participant-joined', makeParticipantUpdateHandler(setParticipants))
        frame.on('participant-updated', makeParticipantUpdateHandler(setParticipants))
        frame.on('participant-left', makeParticipantUpdateHandler(setParticipants))

        return () => {
            callFrame.current.leave()
            callFrame.current.destroy()
        }
    }, [])

    // TODOS: ///////////////

    const [isEditingStatus, setIsEditingStatus] = useState(false)
    const [userToDos, setUserToDos] = useState({})
    const [myToDos, setMyToDos] = useState([])

    const localParticipant = Object.values(participants).find(participant => participant.isLocal)

    useEffect(() => {
      const base = firebaseSlugBase()
      // set(firebaseSlugBase(), {})
      const statusesRef = child(base, 'user_statuses')
      onValue(statusesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const myToDos = data[localParticipant?.name]
          setUserToDos(data)
          setMyToDos(myToDos)
        }
      })
    }, [isEditingStatus, localParticipant])


    const handleAddToDo = (todo) => {
      let newToDo = todo
      const base = firebaseSlugBase()
      if (localParticipant) {
          set(child(base, `user_statuses/${localParticipant.name}`), myToDos ? [...myToDos, newToDo] : [newToDo])
      }
      setIsEditingStatus(false)
    }

    const handleUpdateToDo = (updatedToDos) => {
      const base = firebaseSlugBase()
        if (localParticipant) {
            set(child(base, `user_statuses/${localParticipant.name}`), updatedToDos)
        }
        setIsEditingStatus(false)
    }


    return (
      <div style={{ height: '100vh', minWidth: '100vh', display: 'flex' }}>
        <div
          id='call'
          ref={callWrapperEl}
          style={{ height: '100%', width: '70%' }}
        />
        <div style={{ width: '30%', padding: '10px' }}>
          <h2>Statuses</h2>
          <h3>My Status</h3>
          <ToDoList
            local={true}
            toDos={myToDos}
            handleUpdateToDo={handleUpdateToDo}
            setIsEditingStatus={setIsEditingStatus}
          />
          <ToDoAdd setIsEditingStatus={setIsEditingStatus} handleAddToDo={handleAddToDo}/>
          <h3 style={{ marginTop: 50 }}>Other Statuses</h3>
          {Object.entries(participants)
            .filter(([_, info]) => info.name !== localParticipant?.name)
            .map(([id, info]) => (
              <div key={id}>
                <p><strong>{info.name}</strong></p>
                {info.name in userToDos && userToDos[info.name].map(todo => (
                  <div style={{ display: 'flex', margin: '10px 20px' }}>
                    {todo.checked ? <CheckBoxIcon fontSize="small"/> : <CheckBoxOutlineBlankIcon fontSize="small"/>}
                    <span style={{ marginLeft: 10 }}>{todo.name}</span>
                  </div>
                ))}
              </div>
            ))
          }
        </div>
      </div >
    )
}

export default Call