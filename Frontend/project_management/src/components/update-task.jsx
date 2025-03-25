import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify";
const UpdateTaskDialog = ({ open, onOpenChange, task }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "",
    })

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                status: task.status || "To Do",
            })
        }
    }, [task])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleStatusChange = (value) => {
        setFormData((prev) => ({ ...prev, status: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await axios.put(import.meta.env.VITE_BACKEND + `/api/v1/task/${task._id}`, formData, { withCredentials: true })

        
            onOpenChange(false)


            toast.success("Task updated successfully")

            window.location.reload()
        } catch (error) {
            console.error("Error updating task:", error)
            toast.error("Failed to update task. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return

        setIsDeleting(true)

        try {
            await axios.delete(import.meta.env.VITE_BACKEND + `/api/v1/task/${task._id}`, { withCredentials: true })

            // Close dialog
            onOpenChange(false)

            toast({
                title: "Task deleted",
                description: "Your task has been deleted successfully.",
            })

            window.location.reload()
        } catch (error) {
            console.error("Error deleting task:", error)
            toast.error("Failed to delete task. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Update Task</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter task description"
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="To Do">To Do</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="mt-6 flex items-center justify-between">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isSubmitting || isDeleting}
                            className="flex items-center"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting || isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting || isDeleting}>
                                {isSubmitting ? "Updating..." : "Update Task"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateTaskDialog

