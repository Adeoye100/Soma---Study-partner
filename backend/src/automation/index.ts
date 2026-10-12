// Automation Framework Main Exports
// Comprehensive automation system for workflow orchestration, business rules, and intelligent processing
//
// ── DEAD-CODE INVENTORY (2026-10-12) ─────────────────────────────────────────
//
// LIVE tree (reachable from routes/automation.ts):
//   src/automation/                ← this directory — the only live automation tree
//
// UNREACHABLE trees (no route or import connects to them):
//   src/domain/automation/         ← AutomationEngine — parallel impl, not imported anywhere
//   src/infrastructure/automation/ ← AutomationEngine — parallel impl, not imported anywhere
//   src/application/automation/    ← 5 subdirectories, not imported anywhere
//   src/services/workflow/         ← WorkflowEngine — separate class, different constructor, not imported
//
// Before extending the automation system, decide which tree is canonical and
// delete the others. The inline require() in AutomationOrchestrator has been
// replaced with a proper import of geminiService.generateExam (2026-10-12).
//
// ─────────────────────────────────────────────────────────────────────────────

// Import instances for re-export
import { automationOrchestrator } from './AutomationOrchestrator';
import { automationMonitor } from './monitoring/AutomationMonitor';
import { inputProcessorRegistry } from './processors/InputProcessor';
import { outputGeneratorRegistry } from './output/OutputGenerator';

// Core Components
export { AutomationOrchestrator, automationOrchestrator } from './AutomationOrchestrator';
export { WorkflowEngine } from './core/WorkflowEngine';
export { WorkflowOrchestrator } from './core/WorkflowOrchestrator';
export { DistributedTaskEngine } from './core/DistributedTaskEngine';
export { PriorityScheduler } from './core/PriorityScheduler';
export { ConfigurationManager } from './core/ConfigurationManager';
export { ErrorHandlingSystem } from './core/ErrorHandlingSystem';
export { MultiFormatIOProcessor } from './core/MultiFormatIOProcessor';

// Types and Interfaces
export * from './core/types';

// Input Processing
export { InputProcessorRegistry, inputProcessorRegistry } from './processors/InputProcessor';
export { BaseInputProcessor } from './processors/InputProcessor';
export { MaterialInputProcessor } from './processors/InputProcessor';
export { ExamConfigInputProcessor } from './processors/InputProcessor';
export { UserInputProcessor } from './processors/InputProcessor';

// Output Generation
export { OutputGeneratorRegistry, outputGeneratorRegistry } from './output/OutputGenerator';
export { BaseOutputGenerator } from './output/OutputGenerator';
export { JsonOutputGenerator } from './output/OutputGenerator';
export { HtmlOutputGenerator } from './output/OutputGenerator';
export { CsvOutputGenerator } from './output/OutputGenerator';
export { XmlOutputGenerator } from './output/OutputGenerator';

// Business Rules
export { BusinessRulesEngine } from './rules/BusinessRulesEngine';
export { createExamBusinessRules } from './rules/ExamBusinessRules';

// Error Handling
export { CircuitBreaker } from './core/ErrorHandlingSystem';

// Monitoring
export { AutomationMonitor, automationMonitor } from './monitoring/AutomationMonitor';
export { EnterpriseMonitoringSystem } from './monitoring/EnterpriseMonitoringSystem';
export { EventEmitter } from './monitoring/EventEmitter';
export { ProcessMonitor } from './monitoring/ProcessMonitor';
export { SystemMetrics } from './monitoring/SystemMetrics';
export { DistributedTracing } from './monitoring/DistributedTracing';

// Queues
export { TaskQueueManager } from './queues/TaskQueueManager';

// Integrations
export { ApiIntegration } from './integrations/ApiIntegration';

// Utility Functions
export {
  startAutomationMonitoring,
  stopAutomationMonitoring,
  recordCustomMetric,
  getAutomationHealth,
  getAutomationMetrics,
  getAutomationStatistics
} from './monitoring/AutomationMonitor';

// Version and Metadata
export const AUTOMATION_FRAMEWORK_VERSION = '1.0.0';
export const AUTOMATION_FRAMEWORK_DESCRIPTION = 'Comprehensive automation framework for workflow orchestration, business rules, and intelligent processing';

// Framework Capabilities
export const FRAMEWORK_CAPABILITIES = [
  'parallel-execution',
  'prioritization',
  'workflow-orchestration',
  'business-rules-engine',
  'multi-format-io',
  'error-recovery',
  'circuit-breakers',
  'monitoring',
  'distributed-tracing',
  'configuration-management',
  'health-checks',
  'alerting'
];

// Quick Start Function
export async function initializeAutomationFramework(): Promise<void> {
  try {
    // Initialize core orchestrator
    await automationOrchestrator.initialize();

    // Start monitoring
    automationMonitor.startMonitoring();

    console.log('✅ Automation Framework initialized successfully');
    console.log(`📊 Version: ${AUTOMATION_FRAMEWORK_VERSION}`);
    console.log(`🔧 Capabilities: ${FRAMEWORK_CAPABILITIES.join(', ')}`);

  } catch (error) {
    console.error('❌ Failed to initialize Automation Framework:', error);
    throw error;
  }
}

// Health Check Function
export async function checkAutomationHealth(): Promise<{
  healthy: boolean;
  details: any;
  timestamp: Date;
}> {
  try {
    const health = await automationOrchestrator.healthCheck();
    const monitorHealth = await automationMonitor.getHealthStatus();

    return {
      healthy: health.healthy && monitorHealth.healthy,
      details: {
        orchestrator: health.details,
        monitor: monitorHealth.details
      },
      timestamp: new Date()
    };
  } catch (error) {
    return {
      healthy: false,
      details: { error: (error as Error).message },
      timestamp: new Date()
    };
  }
}