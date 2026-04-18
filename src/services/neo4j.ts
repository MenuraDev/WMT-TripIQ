import { Neo4j } from 'neo4j-driver';

/**
 * Neo4j Database Connection Service
 * Manages connection pool and provides query execution utilities
 */

class Neo4jService {
  private driver: any = null;
  private uri: string;
  private user: string;
  private password: string;

  constructor() {
    this.uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    this.user = process.env.NEO4J_USER || 'neo4j';
    this.password = process.env.NEO4J_PASSWORD || 'password';
  }

  /**
   * Initialize database connection
   */
  async connect(): Promise<void> {
    try {
      const neo4j = await import('neo4j-driver');
      this.driver = neo4j.default.driver(
        this.uri,
        neo4j.default.auth.basic(this.user, this.password),
        {
          maxConnectionPoolSize: 50,
          connectionAcquisitionTimeout: 30000,
        }
      );

      // Verify connection
      await this.driver.verifyConnectivity();
      console.log('✅ Neo4j connected successfully');
    } catch (error) {
      console.error('❌ Neo4j connection failed:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      console.log('Neo4j connection closed');
    }
  }

  /**
   * Execute a read query
   */
  async readQuery<T>(query: string, parameters: Record<string, any> = {}): Promise<T[]> {
    if (!this.driver) {
      throw new Error('Database not connected');
    }

    const session = this.driver.session({ database: 'neo4j', defaultAccessMode: 'READ' });
    
    try {
      const result = await session.run(query, parameters);
      return result.records.map(record => {
        const obj: any = {};
        record.keys.forEach(key => {
          obj[key] = record.get(key);
        });
        return obj as T;
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Execute a write query
   */
  async writeQuery<T>(query: string, parameters: Record<string, any> = {}): Promise<T[]> {
    if (!this.driver) {
      throw new Error('Database not connected');
    }

    const session = this.driver.session({ database: 'neo4j', defaultAccessMode: 'WRITE' });
    
    try {
      const result = await session.run(query, parameters);
      return result.records.map(record => {
        const obj: any = {};
        record.keys.forEach(key => {
          obj[key] = record.get(key);
        });
        return obj as T;
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Execute a transaction with multiple queries
   */
  async transaction<T>(queries: Array<{ query: string; parameters?: Record<string, any> }>): Promise<T[]> {
    if (!this.driver) {
      throw new Error('Database not connected');
    }

    const session = this.driver.session({ database: 'neo4j' });
    
    try {
      const result = await session.executeWrite(async (tx: any) => {
        const results: any[] = [];
        
        for (const { query, parameters = {} } of queries) {
          const res = await tx.run(query, parameters);
          results.push(res.records.map((record: any) => {
            const obj: any = {};
            record.keys.forEach((key: string) => {
              obj[key] = record.get(key);
            });
            return obj;
          }));
        }
        
        return results.flat();
      });
      
      return result as T[];
    } finally {
      await session.close();
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.readQuery('RETURN 1 as check');
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const neo4jService = new Neo4jService();
export default neo4jService;
