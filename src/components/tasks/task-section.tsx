import { TaskItem } from "@/components/tasks/task-item"

type TaskForSection = {
  id: string
  title: string
  dueDate: Date | null
}

export function TaskSection({
  icon,
  title,
  tasks,
  emptyLabel,
  markOverdue = false,
}: {
  icon: string
  title: string
  tasks: TaskForSection[]
  emptyLabel: string
  markOverdue?: boolean
}) {
  const now = new Date()

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">
        {icon} {title}
      </h2>
      {tasks.length === 0 ? (
        <p className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              dueDate={task.dueDate}
              overdue={markOverdue && Boolean(task.dueDate && task.dueDate < now)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
