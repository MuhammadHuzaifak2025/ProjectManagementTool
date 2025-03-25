import React, { useState } from 'react'
import KanbanBoard from './kanban'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import AddTaskDialog from './add-task'
import UpdateTaskDialog from './update-task'

const Dashboard = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isUpdateTaskOpen, setIsUpdateTaskOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)

  const handleOpenUpdateTask = (task) => {
    setCurrentTask(task)
    setIsUpdateTaskOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Task Management Dashboard</h1>
          <Button onClick={() => setIsAddTaskOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <KanbanBoard onUpdateTask={handleOpenUpdateTask} />
        </div>
      </div>

      <AddTaskDialog 
        open={isAddTaskOpen} 
        onOpenChange={setIsAddTaskOpen} 
      />
      
      {currentTask && (
        <UpdateTaskDialog 
          open={isUpdateTaskOpen} 
          onOpenChange={setIsUpdateTaskOpen}
          task={currentTask}
        />
      )}
    </div>
  )
}

export default Dashboard