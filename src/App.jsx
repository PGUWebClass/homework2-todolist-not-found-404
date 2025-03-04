import React, { useState } from "react";
import { Plus, Trash2, Check, X, Edit } from "lucide-react";

export default function App() {
	const [status, setStatus] = useState("all");
	const [group, setGroup] = useState("default");
	const [tasks, setTasks] = useState([]);
	const [groups, setGroups] = useState(["default"]);

	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
	const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);


	const [newTaskName, setNewTaskName] = useState("");
	const [newGroupName, setNewGroupName] = useState("");
	const [editingTask, setEditingTask] = useState(null);


	const addTask = () => {
		if (!newTaskName.trim()) return;

		const newTask = { 
			name: newTaskName, 
			status: "active", 
			group: group 
		};

		setTasks([...tasks, newTask]);
		setNewTaskName("");
		setIsTaskModalOpen(false);
	};

	// Edit Task Modal Handler
	const editTask = () => {
		if (!editingTask || !newTaskName.trim()) return;

		const updatedTasks = [...tasks];
		updatedTasks[editingTask.index] = {
			...updatedTasks[editingTask.index],
			name: newTaskName
		};

		setTasks(updatedTasks);
		setNewTaskName("");
		setIsEditTaskModalOpen(false);
		setEditingTask(null);
	};

	const openEditTaskModal = (task, index) => {
		setEditingTask({ ...task, index });
		setNewTaskName(task.name);
		setIsEditTaskModalOpen(true);
	};

	
	const addGroup = () => {
		const trimmedGroupName = newGroupName.trim();
		if (trimmedGroupName && !groups.includes(trimmedGroupName)) {
			setGroups([...groups, trimmedGroupName]);
			setNewGroupName("");
			setIsGroupModalOpen(false);
		}
	};

	
	const deleteGroup = (groupToDelete) => {
		
		if (groupToDelete === "default") return;

		
		const updatedGroups = groups.filter(g => g !== groupToDelete);
		setGroups(updatedGroups);

		const updatedTasks = tasks.filter(task => task.group !== groupToDelete);
		setTasks(updatedTasks);

		if (group === groupToDelete) {
			setGroup("default");
		}
	};

	const toggleTaskStatus = (index) => {
		const updatedTasks = [...tasks];
		updatedTasks[index].status = 
			updatedTasks[index].status === "active" ? "completed" : "active";
		setTasks(updatedTasks);
	};

	const deleteTask = (index) => {
		const updatedTasks = tasks.filter((_, i) => i !== index);
		setTasks(updatedTasks);
	};

	return (
		<div className="w-full mx-auto bg-white min-h-screen">
			{/* Header */}
			<header className="flex justify-between bg-[#C5BAFF] py-5 px-6 shadow-md">
				<h1 className="text-white font-bold text-4xl md:text-5xl tracking-wide">
					ToDo
				</h1>
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/5/5d/GNOME_Todo_icon_2019.svg"
					alt="GNOME Todo Icon"
					className="w-12 h-12 md:w-14 md:h-14"
				/>
			</header>

			<main className="px-6 py-10">
				<div className="flex flex-col md:flex-row md:justify-between gap-6">
					{/* Filters */}
					<div className="flex gap-x-4 flex-col sm:flex-row">
						{/* Status Dropdown */}
						<div>
							<label className="block font-semibold text-gray-700 mb-2 text-lg">
								Status
							</label>
							<select
								className="border-2 border-gray-400 rounded-lg px-4 py-2 w-44 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
							>
								<option value="all">All</option>
								<option value="active">Pending</option>
								<option value="completed">Completed</option>
							</select>
						</div>

						{/* Group Dropdown */}
						<div>
							<label className="block font-semibold text-gray-700 mb-2 text-lg">
								Group
							</label>
							<div className="flex items-center space-x-2">
								<select
									className="border-2 border-gray-400 rounded-lg px-4 py-2 w-44 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
									value={group}
									onChange={(e) => setGroup(e.target.value)}
								>
									{groups.map((g) => (
										<option key={g} value={g}>{g}</option>
									))}
								</select>
								{group !== "default" && (
									<button 
										onClick={() => deleteGroup(group)}
										className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
									>
										<Trash2 size={16} />
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Add Buttons */}
					<div>
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Add Task Button */}
							<button 
								onClick={() => setIsTaskModalOpen(true)}
								className="flex items-center hover:bg-[#C5BAFF] hover:text-white transition-colors duration-700 gap-2 border-[#C5BAFF] px-4 py-2 rounded-md shadow-xl h-10">
								<Plus size={18} />
								<span className="text-lg">Add Task</span>
							</button>

							{/* Add Group Button */}
							<button 
								onClick={() => setIsGroupModalOpen(true)}
								className="flex items-center hover:bg-[#C5BAFF] hover:text-white transition-colors duration-700 gap-2 border-[#C5BAFF] px-4 py-2 rounded-md shadow-xl h-10">
								<Plus size={16} />
								<span className="text-lg">Add Group</span>
							</button>
						</div>
					</div>
				</div>

				{/* Task List */}
				<ul className="mt-8 space-y-4">
					{tasks
						.filter(task => status === "all" || task.status === status)
						.filter(task => task.group === group)
						.map((task, index) => (
							<li 
								key={index} 
								className={`
									flex justify-between items-center border p-3 rounded-lg shadow
									${task.status === 'completed' 
										? 'bg-green-50 border-green-200' 
										: 'bg-white border-gray-200'}
								`}
							>
								<span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
									{task.name}
								</span>
								<div className="flex items-center space-x-2">
									<button 
										onClick={() => openEditTaskModal(task, index)}
										className="p-1 rounded-full bg-blue-100 text-blue-600"
									>
										<Edit size={16} />
									</button>
									<button 
										onClick={() => toggleTaskStatus(index)}
										className={`
											p-1 rounded-full
											${task.status === 'completed' 
												? 'bg-green-100 text-green-600' 
												: 'bg-gray-100 text-gray-600'}
										`}
									>
										{task.status === 'completed' ? <X size={16} /> : <Check size={16} />}
									</button>
									<button 
										onClick={() => deleteTask(index)}
										className="p-1 rounded-full bg-red-100 text-red-600"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</li>
						))}
				</ul>
			</main>

			{/* Add Task Modal */}
			{(isTaskModalOpen || isEditTaskModalOpen || isGroupModalOpen) && (
				<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
					{isTaskModalOpen && (
						<div className="bg-white p-6 rounded-lg w-96 relative">
							<h2 className="text-2xl font-bold mb-4">Add New Task</h2>
							<input 
								type="text"
								placeholder="Task Name"
								value={newTaskName}
								onChange={(e) => setNewTaskName(e.target.value)}
								className="w-full border-2 border-gray-300 rounded-lg p-2 mb-4"
							/>
							<div className="flex justify-end space-x-2">
								<button 
									onClick={() => setIsTaskModalOpen(false)}
									className="px-4 py-2 bg-gray-200 rounded-lg"
								>
									Cancel
								</button>
								<button 
									onClick={addTask}
									className="px-4 py-2 bg-[#C5BAFF] text-white rounded-lg"
								>
									Add Task
								</button>
							</div>
						</div>
					)}

					{/* Edit Task Modal */}
					{isEditTaskModalOpen && (
						<div className="bg-white p-6 rounded-lg w-96 relative">
							<h2 className="text-2xl font-bold mb-4">Edit Task</h2>
							<input 
								type="text"
								placeholder="Task Name"
								value={newTaskName}
								onChange={(e) => setNewTaskName(e.target.value)}
								className="w-full border-2 border-gray-300 rounded-lg p-2 mb-4"
							/>
							<div className="flex justify-end space-x-2">
								<button 
									onClick={() => setIsEditTaskModalOpen(false)}
									className="px-4 py-2 bg-gray-200 rounded-lg"
								>
									Cancel
								</button>
								<button 
									onClick={editTask}
									className="px-4 py-2 bg-[#C5BAFF] text-white rounded-lg"
								>
									Save Changes
								</button>
							</div>
						</div>
					)}

					{/* Add Group Modal */}
					{isGroupModalOpen && (
						<div className="bg-white p-6 rounded-lg w-96 relative">
							<h2 className="text-2xl font-bold mb-4">Add New Group</h2>
							<input 
								type="text"
								placeholder="Group Name"
								value={newGroupName}
								onChange={(e) => setNewGroupName(e.target.value)}
								className="w-full border-2 border-gray-300 rounded-lg p-2 mb-4"
							/>
							<div className="flex justify-end space-x-2">
								<button 
									onClick={() => setIsGroupModalOpen(false)}
									className="px-4 py-2 bg-gray-200 rounded-lg"
								>
									Cancel
								</button>
								<button 
									onClick={addGroup}
									className="px-4 py-2 bg-[#C5BAFF] text-white rounded-lg"
								>
									Add Group
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}