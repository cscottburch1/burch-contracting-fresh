import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from '@/lib/mysql';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: proposalId } = await context.params;

    const [proposals] = await mysql.query(
      `SELECT * FROM proposals WHERE id = ?`,
      [proposalId]
    );

    if (!proposals || (proposals as any[]).length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ proposal: (proposals as any[])[0] });

  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: proposalId } = await context.params;
    const data = await request.json();

    // Support both status-only updates and full proposal updates
    if (data.status && Object.keys(data).length === 1) {
      // Just update status
      await mysql.query(
        `UPDATE proposals SET status = ?, updated_at = NOW() WHERE id = ?`,
        [data.status, proposalId]
      );
    } else {
      // Full proposal update
      const { customer_id, items, subtotal, tax, total, notes } = data;
      
      await mysql.query(
        `UPDATE proposals 
         SET customer_id = ?, items = ?, subtotal = ?, tax = ?, total = ?, notes = ?, updated_at = NOW() 
         WHERE id = ?`,
        [customer_id, JSON.stringify(items), subtotal, tax, total, notes || '', proposalId]
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Proposal updated successfully'
    });

  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: proposalId } = await context.params;

    // Check if proposal is already accepted (prevent deletion of accepted proposals)
    const [proposals] = await mysql.query(
      `SELECT status FROM proposals WHERE id = ?`,
      [proposalId]
    );

    if (!proposals || (proposals as any[]).length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = (proposals as any[])[0];
    if (proposal.status === 'accepted') {
      return NextResponse.json(
        { error: 'Cannot delete accepted proposals' },
        { status: 400 }
      );
    }

    await mysql.query(`DELETE FROM proposals WHERE id = ?`, [proposalId]);

    return NextResponse.json({ 
      success: true,
      message: 'Proposal deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to delete proposal' },
      { status: 500 }
    );
  }
}
