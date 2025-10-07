'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Settings, Eye, EyeOff, RotateCcw, Check, X, Search, GripVertical, ChevronDown } from 'lucide-react';

export interface ColumnConfig {
  label: string;
  sortable: boolean;
  width: string;
  responsive: string;
  visible: boolean;
  required?: boolean; // Required columns cannot be hidden
  description?: string; // Optional description for columns
}

export interface ColumnManagerProps {
  columns: Record<string, ColumnConfig>;
  onColumnsChange: (columns: Record<string, ColumnConfig>) => void;
  activeTab: string;
  activeSubTab?: string;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({
  columns,
  onColumnsChange,
  activeTab,
  activeSubTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localColumns, setLocalColumns] = useState<Record<string, ColumnConfig>>(columns);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load saved preferences from localStorage
  useEffect(() => {
    const storageKey = `columnPreferences_${activeTab}_${activeSubTab || 'default'}`;
    const savedPreferences = localStorage.getItem(storageKey);
    
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        const updatedColumns = { ...columns };
        
        // Apply saved visibility preferences
        Object.keys(parsed).forEach(key => {
          if (updatedColumns[key]) {
            updatedColumns[key] = {
              ...updatedColumns[key],
              visible: parsed[key].visible
            };
          }
        });
        
        setLocalColumns(updatedColumns);
        onColumnsChange(updatedColumns);
      } catch (error) {
        console.error('Error loading column preferences:', error);
      }
    }
  }, [activeTab, activeSubTab]);

  // Save preferences to localStorage
  const savePreferences = (cols: Record<string, ColumnConfig>) => {
    const storageKey = `columnPreferences_${activeTab}_${activeSubTab || 'default'}`;
    const preferences: Record<string, { visible: boolean }> = {};
    
    Object.keys(cols).forEach(key => {
      preferences[key] = { visible: cols[key].visible };
    });
    
    localStorage.setItem(storageKey, JSON.stringify(preferences));
  };

  // Reset to default
  const resetToDefault = () => {
    const defaultColumns = { ...columns };
    Object.keys(defaultColumns).forEach(key => {
      defaultColumns[key] = {
        ...defaultColumns[key],
        visible: !defaultColumns[key].required
      };
    });
    
    setLocalColumns(defaultColumns);
    setHasChanges(true);
  };

  // Apply changes
  const applyChanges = () => {
    onColumnsChange(localColumns);
    savePreferences(localColumns);
    setHasChanges(false);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Cancel changes
  const cancelChanges = () => {
    setLocalColumns(columns);
    setHasChanges(false);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Toggle column visibility
  const toggleColumn = (key: string) => {
    if (localColumns[key].required) return;
    
    const updatedColumns = {
      ...localColumns,
      [key]: {
        ...localColumns[key],
        visible: !localColumns[key].visible
      }
    };
    
    setLocalColumns(updatedColumns);
    setHasChanges(true);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, key: string) => {
    setDraggedItem(key);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    setDragOverItem(key);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetKey) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const columnKeys = Object.keys(localColumns);
    const draggedIndex = columnKeys.indexOf(draggedItem);
    const targetIndex = columnKeys.indexOf(targetKey);
    
    const newKeys = [...columnKeys];
    newKeys.splice(draggedIndex, 1);
    newKeys.splice(targetIndex, 0, draggedItem);
    
    const reorderedColumns: Record<string, ColumnConfig> = {};
    newKeys.forEach(k => {
      reorderedColumns[k] = localColumns[k];
    });
    
    setLocalColumns(reorderedColumns);
    setHasChanges(true);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Filter columns based on search
  const filteredColumns = Object.entries(localColumns).filter(([key, column]) =>
    column.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleColumnsCount = Object.values(localColumns).filter(col => col.visible).length;
  const totalColumnsCount = Object.keys(localColumns).length;

  // Close dropdown on escape key or click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        cancelChanges();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && 
          dropdownRef.current && 
          !dropdownRef.current.contains(e.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(e.target as Node)) {
        cancelChanges();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        title="Manage Columns"
      >
        <Settings className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Columns</span>
        <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
          {visibleColumnsCount}/{totalColumnsCount}
        </span>
        <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          {/* Dropdown Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-900">Columns</h3>
              <span className="text-xs text-gray-500">
                {visibleColumnsCount}/{totalColumnsCount}
              </span>
            </div>
            <button
              onClick={cancelChanges}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Column List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredColumns.map(([key, column]) => (
              <div
                key={key}
                draggable
                onDragStart={(e) => handleDragStart(e, key)}
                onDragOver={(e) => handleDragOver(e, key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, key)}
                className={`flex items-center justify-between p-2 hover:bg-gray-50 transition-colors ${
                  draggedItem === key ? 'opacity-50' : ''
                } ${
                  dragOverItem === key ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {/* Drag Handle */}
                  <GripVertical className="h-3 w-3 text-gray-400 cursor-move flex-shrink-0" />
                  
                  {/* Visibility Toggle */}
                  <button
                    onClick={() => toggleColumn(key)}
                    disabled={column.required}
                    className={`p-1 rounded transition-colors flex-shrink-0 ${
                      column.required 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : column.visible 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={column.required ? 'Required' : column.visible ? 'Hide' : 'Show'}
                  >
                    {column.required ? (
                      <Eye className="h-3 w-3" />
                    ) : column.visible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </button>
                  
                  {/* Column Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className={`text-sm truncate ${
                        column.visible ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {column.label}
                      </span>
                      {column.required && (
                        <span className="text-xs text-red-500">*</span>
                      )}
                      {column.sortable && (
                        <span className="text-xs text-blue-500">↕</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredColumns.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No columns found
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={resetToDefault}
              className="text-xs text-gray-600 hover:text-gray-800 flex items-center space-x-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={cancelChanges}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyChanges}
                disabled={!hasChanges}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  hasChanges
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                <Check className="h-3 w-3 mr-1 inline" />
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnManager;
