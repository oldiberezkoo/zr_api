

// Базовые типы
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Товар/Продукт
interface Product extends BaseEntity {
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  unit: UnitOfMeasure;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  isActive: boolean;
  attributes: ProductAttribute[];
  images: ProductImage[];
}

interface ProductCategory extends BaseEntity {
  name: string;
  description?: string;
  parentCategory?: ProductCategory;
  subcategories: ProductSubcategory[];
}

interface ProductSubcategory extends BaseEntity {
  name: string;
  description?: string;
  category: ProductCategory;
}

interface ProductAttribute {
  name: string;
  value: string;
}

interface ProductImage {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

// Склад и местоположение
interface Warehouse extends BaseEntity {
  name: string;
  address: Address;
  contactPerson: Contact;
  isActive: boolean;
  zones: WarehouseZone[];
}

interface WarehouseZone extends BaseEntity {
  name: string;
  description?: string;
  warehouse: Warehouse;
  locations: StorageLocation[];
}

interface StorageLocation extends BaseEntity {
  code: string;
  zone: WarehouseZone;
  capacity: number;
  isActive: boolean;
}

// Запасы
interface InventoryItem extends BaseEntity {
  product: Product;
  warehouse: Warehouse;
  location: StorageLocation;
  quantity: number;
  reservedQuantity: number;
  batch?: BatchInfo;
  status: InventoryStatus;
}

interface BatchInfo {
  number: string;
  manufactureDate?: Date;
  expirationDate?: Date;
  vendorBatchNumber?: string;
}

// Движение товаров
interface InventoryTransaction extends BaseEntity {
  type: TransactionType;
  product: Product;
  quantity: number;
  fromWarehouse?: Warehouse;
  toWarehouse?: Warehouse;
  fromLocation?: StorageLocation;
  toLocation?: StorageLocation;
  reference: string;
  batch?: BatchInfo;
  notes?: string;
  performedBy: User;
}

// Поставщики и закупки
interface Supplier extends BaseEntity {
  name: string;
  code: string;
  contact: Contact;
  address: Address;
  paymentTerms: string;
  isActive: boolean;
  taxIdentification?: string;
}

interface PurchaseOrder extends BaseEntity {
  number: string;
  supplier: Supplier;
  status: PurchaseOrderStatus;
  expectedDeliveryDate: Date;
  items: PurchaseOrderItem[];
  totalAmount: number;
  currency: string;
  notes?: string;
  createdBy: User;
}

interface PurchaseOrderItem extends BaseEntity {
  purchaseOrder: PurchaseOrder;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
}

// Общие типы
interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position?: string;
}

interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  warehouse?: Warehouse;
}

// Енамы
enum UnitOfMeasure {
  PIECE = 'PIECE',
  KG = 'KG',
  LITER = 'LITER',
  METER = 'METER',
  BOX = 'BOX',
  PALLET = 'PALLET'
}

enum InventoryStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  DAMAGED = 'DAMAGED',
  EXPIRED = 'EXPIRED',
  IN_TRANSIT = 'IN_TRANSIT'
}

enum TransactionType {
  RECEIPT = 'RECEIPT',
  SHIPMENT = 'SHIPMENT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
  RETURN = 'RETURN'
}

enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  WORKER = 'WORKER',
  VIEWER = 'VIEWER'
}

interface Task extends BaseEntity {
	title: string
	description: string
	priority: TaskPriority
	status: TaskStatus
	startDate: Date
	dueDate: Date
	completedDate?: Date
	assignedTo: User
	createdBy: User
	category: TaskCategory
	tags: string[]
	attachments: Attachment[]
	comments: TaskComment[]
	parentTask?: Task
	subtasks: Task[]
	isRecurring: boolean
	recurringPattern?: RecurringPattern
	relatedProducts?: Product[]
	relatedWarehouse?: Warehouse
	estimatedHours?: number
	actualHours?: number
	progress: number // 0-100
	notifications: TaskNotification[]
}

interface TaskComment extends BaseEntity {
	task: Task
	content: string
	author: User
	attachments: Attachment[]
	mentions: User[]
	parentComment?: TaskComment
	replies: TaskComment[]
}

interface Todo extends BaseEntity {
	title: string
	description?: string
	isCompleted: boolean
	dueDate?: Date
	priority: TaskPriority
	assignedTo?: User
	createdBy: User
	category?: TodoCategory
	checklist: TodoItem[]
	notes?: string
	color?: string
	tags: string[]
}

interface TodoItem {
	id: string
	content: string
	isCompleted: boolean
	completedDate?: Date
	assignedTo?: User
}

interface Note extends BaseEntity {
	title: string
	content: string
	author: User
	category?: NoteCategory
	tags: string[]
	attachments: Attachment[]
	color?: string
	isPinned: boolean
	lastEditedBy: User
	relatedTasks?: Task[]
	relatedTodos?: Todo[]
	visibility: NoteVisibility
	sharedWith: User[]
}

interface CalendarEvent extends BaseEntity {
	title: string
	description?: string
	startDateTime: Date
	endDateTime: Date
	allDay: boolean
	location?: string
	organizer: User
	attendees: EventAttendee[]
	recurrence?: RecurringPattern
	category: EventCategory
	relatedTasks?: Task[]
	reminders: EventReminder[]
	color?: string
	status: EventStatus
}

interface EventAttendee {
	user: User
	status: AttendeeStatus
	responseDate?: Date
	notes?: string
}

interface EventReminder {
	reminderTime: Date
	notificationType: NotificationType
	sentTo: User[]
	isSent: boolean
}

interface Attachment {
	id: string
	fileName: string
	fileType: string
	fileSize: number
	uploadedBy: User
	uploadDate: Date
	url: string
	thumbnailUrl?: string
}

interface RecurringPattern {
	frequency: RecurrenceFrequency
	interval: number
	daysOfWeek?: DayOfWeek[]
	daysOfMonth?: number[]
	monthsOfYear?: number[]
	endDate?: Date
	occurrences?: number
}

interface TaskNotification {
	id: string
	type: NotificationType
	message: string
	createdAt: Date
	isRead: boolean
	recipient: User
}

// Категории
interface TaskCategory extends BaseEntity {
	name: string
	description?: string
	color: string
	parentCategory?: TaskCategory
	subcategories: TaskCategory[]
}

interface TodoCategory extends BaseEntity {
	name: string
	description?: string
	color: string
}

interface NoteCategory extends BaseEntity {
	name: string
	description?: string
	color: string
}

interface EventCategory extends BaseEntity {
	name: string
	description?: string
	color: string
}

// Дополнительные enum'ы
enum TaskPriority {
	CRITICAL = "CRITICAL",
	HIGH = "HIGH",
	MEDIUM = "MEDIUM",
	LOW = "LOW",
}

enum TaskStatus {
	BACKLOG = "BACKLOG",
	TODO = "TODO",
	IN_PROGRESS = "IN_PROGRESS",
	IN_REVIEW = "IN_REVIEW",
	BLOCKED = "BLOCKED",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

enum RecurrenceFrequency {
	DAILY = "DAILY",
	WEEKLY = "WEEKLY",
	MONTHLY = "MONTHLY",
	YEARLY = "YEARLY",
}

enum DayOfWeek {
	MONDAY = "MONDAY",
	TUESDAY = "TUESDAY",
	WEDNESDAY = "WEDNESDAY",
	THURSDAY = "THURSDAY",
	FRIDAY = "FRIDAY",
	SATURDAY = "SATURDAY",
	SUNDAY = "SUNDAY",
}

enum NotificationType {
	EMAIL = "EMAIL",
	PUSH = "PUSH",
	SMS = "SMS",
	IN_APP = "IN_APP",
}

enum NoteVisibility {
	PRIVATE = "PRIVATE",
	TEAM = "TEAM",
	PUBLIC = "PUBLIC",
}

enum EventStatus {
	SCHEDULED = "SCHEDULED",
	CANCELLED = "CANCELLED",
	COMPLETED = "COMPLETED",
	IN_PROGRESS = "IN_PROGRESS",
}

enum AttendeeStatus {
	PENDING = "PENDING",	ACCEPTED = "ACCEPTED",
	DECLINED = "DECLINED",
	TENTATIVE = "TENTATIVE",
}
