import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, CalendarIcon } from "lucide-react"
import { toast } from "react-toastify"
import axiosInstance from "@/Auth/axios_instance/axios.js"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

const UpdateTaskDialog = ({ open, onOpenChange, task }) => {
    const token = localStorage.getItem("access-token")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            status: "To Do",
            due_date: new Date(),
        },
    })

    // Update form values when task changes
    useEffect(() => {
        if (task) {
            form.reset({
                title: task.title || "",
                description: task.description || "",
                status: task.status || "To Do",
                // If task has a due_date, parse it, otherwise use current date
                due_date: task.due_date ? parseISO(task.due_date) : new Date(),
            })
        }
    }, [task, form])

    const onSubmit = async (data) => {
        setIsSubmitting(true)

        try {
            // Format the date to ISO string for the API
            const formattedData = {
                ...data,
                due_date: data.due_date.toISOString().split("T")[0],
            }

            await axiosInstance.put(import.meta.env.VITE_BACKEND + `/api/v1/task/${task._id}`, formattedData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            onOpenChange(false)
            toast.success("Task updated successfully")
            window.location.reload()
        } catch (error) {
            console.error("Error updating task:", error)
            toast.error(error.response.data.message || "Failed to update task. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return

        setIsDeleting(true)

        try {
            await axiosInstance.delete(import.meta.env.VITE_BACKEND + `/api/v1/task/${task._id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            // Close dialog
            onOpenChange(false)
            toast.success("Task deleted successfully")
            window.location.reload()
        } catch (error) {
            console.error("Error deleting task:", error)
            toast.error(error.response.data.message || "Failed to delete task. Please try again.")
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

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter task title" {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter task description" rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="To Do">To Do</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Done">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="due_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Due Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateTaskDialog

