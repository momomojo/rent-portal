import { describe, test, expect } from 'vitest';
import { version as reactVersion } from 'react';
import { version as reduxVersion } from '@reduxjs/toolkit';
import packageJson from '../../package.json';

describe('Environment Configuration', () => {
  test('Node.js version meets requirements', () => {
    const nodeVersion = process.version;
    const requiredVersion = packageJson.engines?.node || '>=16.0.0';
    
    // Remove 'v' prefix from Node.js version for comparison
    const cleanNodeVersion = nodeVersion.replace('v', '');
    expect(cleanNodeVersion).toBeDefined();
    // Basic version check - in production we'd use semver for more accurate comparison
    expect(parseFloat(cleanNodeVersion)).toBeGreaterThanOrEqual(16.0);
  });

  test('npm packages are at correct versions', () => {
    // Check core dependencies
    expect(reactVersion).toBe(packageJson.dependencies.react.replace('^', ''));
    expect(reduxVersion).toBe(packageJson.dependencies['@reduxjs/toolkit'].replace('^', ''));
  });

  test('development server configuration is correct', () => {
    // Check Vite config through import.meta
    expect(import.meta.env.MODE).toBe('test');
    expect(import.meta.env.DEV).toBe(false);
    expect(import.meta.env.SSR).toBe(false);
  });

  test('test environment has required globals', () => {
    // Check for testing globals
    expect(typeof expect).toBe('function');
    expect(typeof test).toBe('function');
    expect(typeof describe).toBe('function');
    
    // Check for browser globals
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
    expect(typeof localStorage).toBe('object');
  });
});
