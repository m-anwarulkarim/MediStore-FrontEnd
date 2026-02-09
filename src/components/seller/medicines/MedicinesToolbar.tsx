/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryOption = { id: string; name: string };

export function MedicinesToolbar({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  status,
  onStatusChange,
  limit,
  onLimitChange,
  categories,
  onClear,
}: {
  search: string;
  onSearchChange: (v: string) => void;

  categoryId: string;
  onCategoryChange: (v: string) => void;

  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortByChange: (v: string) => void;
  onSortOrderChange: (v: "asc" | "desc") => void;

  status: "active" | "archived";
  onStatusChange: (v: "active" | "archived") => void;

  limit: number;
  onLimitChange: (v: number) => void;

  categories: CategoryOption[];
  onClear: () => void;
}) {
  return (
    <div className="space-y-3">
      <Tabs value={status} onValueChange={(v: any) => onStatusChange(v as any)}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or manufacturer..."
          />
        </div>

        <div className="md:col-span-3">
          <Select value={categoryId} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Select
            value={sortOrder}
            onValueChange={(v) => onSortOrderChange(v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-1">
          <Select
            value={String(limit)}
            onValueChange={(v) => onLimitChange(Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
