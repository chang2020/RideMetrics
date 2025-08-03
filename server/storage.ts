import { 
  type User, 
  type InsertUser, 
  type Group, 
  type InsertGroup,
  type GroupMembership,
  type InsertGroupMembership,
  type Activity,
  type InsertActivity,
  type GroupActivity,
  type InsertGroupActivity
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Group methods
  getGroup(id: string): Promise<Group | undefined>;
  getGroups(): Promise<Group[]>;
  getGroupsByUserId(userId: string): Promise<Group[]>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: string, group: Partial<InsertGroup>): Promise<Group | undefined>;
  deleteGroup(id: string): Promise<boolean>;

  // Group membership methods
  getGroupMembership(groupId: string, userId: string): Promise<GroupMembership | undefined>;
  getGroupMembers(groupId: string): Promise<(GroupMembership & { user: User })[]>;
  createGroupMembership(membership: InsertGroupMembership): Promise<GroupMembership>;
  deleteGroupMembership(groupId: string, userId: string): Promise<boolean>;

  // Activity methods
  getActivity(id: string): Promise<Activity | undefined>;
  getActivitiesByUserId(userId: string): Promise<Activity[]>;
  getActivitiesByGroupId(groupId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Group activity methods
  getGroupActivities(groupId: string): Promise<(GroupActivity & { user: User })[]>;
  createGroupActivity(groupActivity: InsertGroupActivity): Promise<GroupActivity>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private groups: Map<string, Group>;
  private groupMemberships: Map<string, GroupMembership>;
  private activities: Map<string, Activity>;
  private groupActivities: Map<string, GroupActivity>;

  constructor() {
    this.users = new Map();
    this.groups = new Map();
    this.groupMemberships = new Map();
    this.activities = new Map();
    this.groupActivities = new Map();

    // Create a default user for demo purposes
    const defaultUser: User = {
      id: randomUUID(),
      username: "demo_user",
      email: "demo@example.com",
      name: "Demo User",
      avatar: null,
      stravaConnected: false,
      stravaAccessToken: null,
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getGroup(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async getGroups(): Promise<Group[]> {
    return Array.from(this.groups.values());
  }

  async getGroupsByUserId(userId: string): Promise<Group[]> {
    const userMemberships = Array.from(this.groupMemberships.values())
      .filter(membership => membership.userId === userId);
    
    return userMemberships
      .map(membership => this.groups.get(membership.groupId))
      .filter(group => group !== undefined) as Group[];
  }

  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const id = randomUUID();
    const group: Group = { 
      ...insertGroup, 
      id, 
      createdAt: new Date() 
    };
    this.groups.set(id, group);

    // Add the owner as a member
    const membershipId = randomUUID();
    const membership: GroupMembership = {
      id: membershipId,
      groupId: id,
      userId: insertGroup.ownerId,
      role: "owner",
      joinedAt: new Date(),
    };
    this.groupMemberships.set(membershipId, membership);

    return group;
  }

  async updateGroup(id: string, updateData: Partial<InsertGroup>): Promise<Group | undefined> {
    const group = this.groups.get(id);
    if (!group) return undefined;
    
    const updatedGroup = { ...group, ...updateData };
    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteGroup(id: string): Promise<boolean> {
    const deleted = this.groups.delete(id);
    
    // Remove all memberships for this group
    const membershipsToDelete = Array.from(this.groupMemberships.entries())
      .filter(([_, membership]) => membership.groupId === id)
      .map(([key, _]) => key);
    
    membershipsToDelete.forEach(key => this.groupMemberships.delete(key));
    
    return deleted;
  }

  async getGroupMembership(groupId: string, userId: string): Promise<GroupMembership | undefined> {
    return Array.from(this.groupMemberships.values())
      .find(membership => membership.groupId === groupId && membership.userId === userId);
  }

  async getGroupMembers(groupId: string): Promise<(GroupMembership & { user: User })[]> {
    const memberships = Array.from(this.groupMemberships.values())
      .filter(membership => membership.groupId === groupId);
    
    return memberships
      .map(membership => {
        const user = this.users.get(membership.userId);
        return user ? { ...membership, user } : null;
      })
      .filter(item => item !== null) as (GroupMembership & { user: User })[];
  }

  async createGroupMembership(insertMembership: InsertGroupMembership): Promise<GroupMembership> {
    const id = randomUUID();
    const membership: GroupMembership = { 
      ...insertMembership, 
      id, 
      joinedAt: new Date() 
    };
    this.groupMemberships.set(id, membership);
    return membership;
  }

  async deleteGroupMembership(groupId: string, userId: string): Promise<boolean> {
    const membershipEntry = Array.from(this.groupMemberships.entries())
      .find(([_, membership]) => membership.groupId === groupId && membership.userId === userId);
    
    if (!membershipEntry) return false;
    
    return this.groupMemberships.delete(membershipEntry[0]);
  }

  async getActivity(id: string): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getActivitiesByUserId(userId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  async getActivitiesByGroupId(groupId: string): Promise<Activity[]> {
    const groupMembers = await this.getGroupMembers(groupId);
    const memberUserIds = groupMembers.map(member => member.userId);
    
    return Array.from(this.activities.values())
      .filter(activity => memberUserIds.includes(activity.userId))
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      createdAt: new Date() 
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getGroupActivities(groupId: string): Promise<(GroupActivity & { user: User })[]> {
    const activities = Array.from(this.groupActivities.values())
      .filter(activity => activity.groupId === groupId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return activities
      .map(activity => {
        const user = this.users.get(activity.userId);
        return user ? { ...activity, user } : null;
      })
      .filter(item => item !== null) as (GroupActivity & { user: User })[];
  }

  async createGroupActivity(insertGroupActivity: InsertGroupActivity): Promise<GroupActivity> {
    const id = randomUUID();
    const groupActivity: GroupActivity = { 
      ...insertGroupActivity, 
      id, 
      createdAt: new Date() 
    };
    this.groupActivities.set(id, groupActivity);
    return groupActivity;
  }
}

export const storage = new MemStorage();
