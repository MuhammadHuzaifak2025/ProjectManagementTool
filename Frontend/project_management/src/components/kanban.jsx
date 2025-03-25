import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Edit, Clock, CheckCircle, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const KanbanBoard = ({ onUpdateTask }) => {
    const [tasks, setTasks] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND + "/api/v1/task", {
                    withCredentials: true,
                })
                setTasks(response.data.data || [])
            } catch (error) {
                console.error("Error fetching tasks:", error)
                setTasks([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchTasks()
    }, [])

    const handleDragEnd = async (result) => {
        if (!result.destination) return

        const { source, destination } = result

        // Create a deep copy of the tasks array
        const updatedTasks = [...tasks]

        // Find the task that was moved
        const movedTask = { ...updatedTasks.find((task) => task._id === result.draggableId) }

        if (!movedTask) return

        // Update the status of the moved task
        movedTask.status = destination.droppableId

        // Create a new array with the updated task
        const newTasks = updatedTasks.map((task) => (task._id === movedTask._id ? movedTask : task))

        setTasks(newTasks)

        try {
            await axios.put(
                import.meta.env.VITE_BACKEND + `/api/v1/task/${movedTask._id}`,
                { status: movedTask.status },
                { withCredentials: true },
            )
        } catch (error) {
            console.error("Error updating task:", error)
            // Revert to original tasks if the API call fails
            setTasks(updatedTasks)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "To Do":
                return <Circle className="h-4 w-4 text-blue-500" />
            case "In Progress":
                return <Clock className="h-4 w-4 text-amber-500" />
            case "Done":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            default:
                return null
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "To Do":
                return "bg-blue-100 text-blue-800"
            case "In Progress":
                return "bg-amber-100 text-amber-800"
            case "Done":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const taskGroups = {
        "To Do": tasks.filter((task) => task.status === "To Do"),
        "In Progress": tasks.filter((task) => task.status === "In Progress"),
        Done: tasks.filter((task) => task.status === "Done"),
    }

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading tasks...</div>
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-6">
                {Object.entries(taskGroups).map(([status, statusTasks]) => (
                    <Droppable key={status} droppableId={status}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="w-full md:w-1/3 bg-gray-50 rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    {getStatusIcon(status)}
                                    <h2 className="text-lg font-semibold">{status}</h2>
                                    <Badge variant="outline" className="ml-auto">
                                        {statusTasks.length}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    {statusTasks.map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="p-4 bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => onUpdateTask(task)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                                    <Badge className={`${getStatusColor(task.status)}`}>{task.status}</Badge>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                                {provided.placeholder}

                                {statusTasks.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 text-sm italic">No tasks in this column</div>
                                )}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    )
}

export default KanbanBoard

